import { fs } from "fs";
import { faker } from "@faker-js/faker/locale/fr";
import { expect, assert } from "chai";
import { bcrypt } from "bcrypt";

import { MongoMemoryServer } from "mongodb-memory-server";
import { mongoose } from "mongoose";

import { User, Teacher, Student, Group, Department } from "../../database/models/index.js"
import { importCSV, createUsersFromCSV, createStudentData } from "../../controllers/users.controller";
import { findOrCreateStudent } from "../../database/queries/users.queries";
import { findOrCreateGroup } from "../../database/queries/groups.queries";

const studentsList = fs.readFileSync("data/StudentsList.csv", "latin1");
const studentsListSemicolon = fs.readFileSync("data/StudentsListSemicolon.csv", "latin1");
const studentsListMissingFields = fs.readFileSync("data/StudentsListMissingFields.csv", "latin1");
const studentsListDuplicates = fs.readFileSync("data/StudentsListDuplicates.csv", "latin1");

const studentCodePadding = 7;
const groupCodePadding = 5;

const getUniqueGroups = (data) => [...new Set(data.map((data) => data.group))];
const countUniqueGroups = (data) => [...new Set(data.map((data) => data.group))].length;
const generateRandomCode = (paddingLength) =>
  String(Math.floor(Math.random() * (10 ** paddingLength - 1)) + 1).padStart(paddingLength, "0");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const failedAssertion = "This assertion should not be reached.";

describe("Test users controller", async () => {
  let res;

  beforeEach(() => {
    res = {
      json: (data) => {
        res.body = data;
      },
      send: (data) => {
        res.error = data;
      },
      status: (code) => {
        res.statusCode = code;
        return res;
      }
    };
  });

  describe("Test create students from a CSV file", () => {
    it("Should validate student data..", (done) => {
      importCSV(studentsList)
        .then((students) => {
          students.forEach((student) => {
            expect(student.code).to.match(/^\d+$/);
            expect(student.group).to.match(/^\d+$/);
            expect(student.firstName).to.match(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-.]+$/);
            expect(student.lastName).to.match(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-.]+$/);
            expect(student.program).to.match(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-.]+$/);
          });
          done();
        })
        .catch(done);
    });

    it("Should accept a semicolon separated CSV file", (done) => {
      importCSV(studentsListSemicolon)
        .then((students) => {
          students.forEach((student) => {
            expect(student.code).to.match(/^\d+$/);
            expect(student.group).to.match(/^\d+$/);
            expect(student.firstName).to.match(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-.]+$/);
            expect(student.lastName).to.match(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-.]+$/);
            expect(student.program).to.match(/^[A-Za-zÀ-ÖØ-öø-ÿ\s-.]+$/);
          });
          done();
        })
        .catch(done);
    });

    it("Should fail to import a CSV file with missing fields", async () => {
      students = await importCSV(studentsListMissingFields);

      expect(students).to.be.empty;
    });
  });

  describe("Test database related functions", async () => {
    let daemon;
    let students;

    before(async () => {
      daemon = await MongoMemoryServer.create();

      const uri = daemon.getUri();

      await mongoose.connect(uri, options);
      await mongoose.connection.db.dropDatabase();

      students = await importCSV(studentsList);
    });

    after(async () => {
      await mongoose.disconnect();
      await daemon.stop();
    });

    it("Should create a single student", async () => {
      const data = {
        code: generateRandomCode(studentCodePadding),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      const student = await findOrCreateStudent(data);

      expect(student).to.exist;

      assert.instanceOf(student, Student);

      expect(student.code).to.equal(data.code);
      expect(student.firstName).to.equal(data.firstName);
      expect(student.lastName).to.equal(data.lastName);

      assert(await bcrypt.compare(data.code, student.local.password));
    });

    it("Should fail to create a student with missing data", async () => {
      const seed = {
        code: generateRandomCode(studentCodePadding),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      for (const code of [seed.code, null, undefined]) {
        for (const firstName of [seed.firstName, null, undefined]) {
          for (const lastName of [seed.lastName, null, undefined]) {
            if (!(code && firstName && lastName)) {
              const data = {
                code: code,
                firstName: firstName,
                lastName: lastName,
              };

              try {
                student = await findOrCreateStudent(data);
                assert.fail(failedAssertion);
              } catch (error) {
                expect(error.message).to.not.equal(failedAssertion);
                assert.isOk(error);
              }
            }
          }
        }
      }
    });

    it("Should NOT create a student twice", async () => {
      const data = {
        code: generateRandomCode(studentCodePadding),
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      };

      const student = await findOrCreateStudent(data);
      const another = await findOrCreateStudent(data);

      expect(student).to.include({
        code: another.code,
        firstName: another.firstName,
        lastName: another.lastName,
      });

      expect(student.local.email).to.equal(another.local.email);

      const students = await Student.find({ code: data.code });

      expect(students).to.have.lengthOf(1);
    });

    it("Should find or create groups", async () => {
      const groups = [];

      for (const student of students) {
        const group = await findOrCreateGroup(student.group);

        search = groups.find((n) => n.code === group.code);

        if (search) {
          Object.assign(search, group);
        } else {
          groups.push(group);
        }
      }

      expect(groups.length).to.equal(countUniqueGroups(students));
      expect(groups.map((n) => n.code)).to.include.members(getUniqueGroups(students));
    });

    it("Should fail to create a group with a missing code", async () => {
      for (const code of [null, undefined]) {
        const student = {
          group: code,
        };

        try {
          await findOrCreateGroup(student.group);
          assert.fail(failedAssertion);
        } catch (error) {
          expect(error.message).to.not.equal(failedAssertion);
          assert.isOk(error);
        }
      }
    });

    it("Should include all imported student groups and data", async () => {
      const req = {
        body: {
          data: studentsList,
        },
      };

      await createUsersFromCSV(req, res);

      const groups = res.body.result;

      expect(groups.length).to.equal(countUniqueGroups(students));
      expect(groups.map((n) => n.code)).to.include.members(getUniqueGroups(students));

      for (const student of students) {
        const group = groups.find((group) => group.code === student.group);
        
        expect(group).to.exist;

        const another = group.students.find((n) => n.code === student.code);

        expect(another).to.exist;

        expect(student).to.include({
          code: another.code,
          firstName: another.firstName,
          lastName: another.lastName,
        });
      }
    });

    it("Should include all imported student groups and data (semicolon)", async () => {
      const req = {
        body: {
          data: studentsListSemicolon,
        }
      };

      await createUsersFromCSV(req, res);

      expect(res.body.result).to.exist;
    });

    it("Should include all imported student groups and data (invalid)", async () => {
      const req = {
        body: {
          data: studentsListMissingFields,
        }
      };

      await createUsersFromCSV(req, res);

      expect(res.body.result).to.exist;
      expect(res.body.result).to.be.empty;
    });

    it("Should NOT add a student to a group twice", async () => {
      const req = {
        body: {
          data: studentsListDuplicates,
        }
      };

      await createUsersFromCSV(req, res);

      expect(res.body).to.exist;
      expect(res.body.result).to.exist;
    
      const groups = res.body.result;

      for (const group of groups) {
        const duplicates = group.students.filter((student, index, self) => {
          return index !== self.findIndex((t) => {
            return t.code === student.code;
          });
        });
        
        expect(duplicates).to.be.empty;
      }
    });
  });
});
