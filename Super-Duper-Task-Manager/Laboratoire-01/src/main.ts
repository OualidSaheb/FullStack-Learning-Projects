import "./style.css";
const titleInput = document.getElementById("title-input") as HTMLInputElement;
const descriptionInput = document.getElementById("description-input") as HTMLInputElement;
const addTaskBtn = document.getElementById("addTaskBtn") as HTMLButtonElement;
const tasksTableHeader = document.getElementById("tasksTableHeader") as HTMLTableSectionElement;
const tasksTable = document.getElementById("tasksTable") as HTMLTableSectionElement;
let selectedTaskId: number | null = null;

class Task {
  static nextId = 1;
  id: number;
  title: string;
  description: string;
  completed: boolean;
  lastModified: Date;

  constructor(title: string, description: string) {
    this.id = Task.nextId++;
    this.title = title;
    this.description = description;
    this.completed = false;
    this.lastModified = new Date();
  }
}

class TaskTracker {
  private tasks: Task[] = [];

  public addTask(title: string, description: string): void {
    if (title == "" || description == "") {
      alert("Le titre et la description doivent être fournis pour ajouter une tâche.");
      return;
    }

    const newTask = new Task(title, description);
    this.tasks.push(newTask);
    this.showTasks();
  }

  // Mettre à jour une tâche
  public updateTaskStatus(id: number, completed: boolean): void {
    const task = this.tasks.find((task) => task.id === id); // Trouver la tâche avec l'ID

    // Si la tâche existe, mettre à jour le statut 'completed' et la date de dernière modification.
    if (task) {
      task.completed = completed;
      task.lastModified = new Date();
    }
    this.showTasks(); // Afficher les tâches actuelles.
  }

  // Modifier une tâche
  public editTask(id: number, title: string, description: string): void {
    // Trouver la tâche avec l'ID
    const task = this.tasks.find((task) => task.id === id);

    // Si la tâche existe, mettre à jour le titre, la description, et la date de dernière modification.
    if (task) {
      task.title = title;
      task.description = description;
      task.lastModified = new Date();
    }

    this.showTasks(); // Afficher les tâches actuelles.
  }

  // Supprimer une tâche
  public deleteTask(id: number): void {
    // Trouver l'index de la tâche avec l'ID.
    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    // Si l'index est valide, supprimer la tâche du tableau
    if (taskIndex > -1) {
      this.tasks.splice(taskIndex, 1);
    }
    this.showTasks(); // Afficher les tâches actuelles.
    this.saveList(); // Sauvegarder les tâches dans le localStorage.
  }

  // Afficher toutes les tâches actuelles.
  public showTasks(): void {
    tasksTable.innerHTML = "";
    if (this.tasks.length === 0) {
      tasksTableHeader.innerHTML = "";
    } else {
      tasksTableHeader.innerHTML = `<th>Task Id</th><th>Title</th><th>Description</th><th>Completed</th><th>Last Modified</th><th>Update/Delete</th>`;

      this.tasks.forEach((task) => {
        const taskElement = this.createTaskElement(task);
        tasksTable.appendChild(taskElement);
      });
    }
  }

  // Sauvegarder les tâches dans le localStorage
  public saveList(): void {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  // Charger les tâches depuis le localStorage
  public loadList(): void {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks).map((taskObj: any) => {
        const task = new Task(taskObj.title, taskObj.description);
        task.id = taskObj.id;
        task.completed = taskObj.completed;
        task.lastModified = new Date(taskObj.lastModified);
        Task.nextId = Math.max(Task.nextId, task.id + 1);
        return task;
      });
      this.showTasks();
    }
  }

  // créer un élément HTML pour une tâche
  private createTaskElement(task: Task): HTMLElement {
    // Créer une nouvelle ligne dans le tableau
    const row = document.createElement("tr");

    // Ajouter ID de la tâche comme un attribut de données à la ligne
    row.setAttribute("data-id", String(task.id));

    // Remplir la ligne avec les détails de la tâche
    row.innerHTML = `
      <td>${task.id}</td>
      <td>${task.title}</td>
      <td>${task.description}</td>
      <td><input type="checkbox" ${task.completed ? "checked" : ""}></td>
      <td>${task.lastModified.toLocaleString()}</td>
      <td><button class="commandBtn updateBtn">Update</button><button class="commandBtn deleteBtn">Delete</button></td>
    `;

    // Récupérer le bouton de mise à jour de la tâche
    const updateBtn = row.querySelector(".updateBtn");
    // Si le bouton existe, la mise à jour de la tâche
    if (updateBtn) {
      updateBtn.addEventListener("click", () => {
        selectedTaskId = task.id;
        titleInput.value = task.title;
        descriptionInput.value = task.description;
        addTaskBtn.textContent = "Save changes";
      });
    }

    // déclencher la suppression de la tâche
    row.querySelector(".deleteBtn")?.addEventListener("click", () => this.deleteTask(task.id));

    //  à cocher pour déclencher la mise à jour du statut de la tâche
    row.querySelector('input[type="checkbox"]')?.addEventListener("change", (event) => {
      const checkbox = event.target as HTMLInputElement;
      this.updateTaskStatus(task.id, checkbox.checked);
    });

    // Retourner l'élément de ligne créé
    return row;
  }
}

const tracker = new TaskTracker();
tracker.loadList();
// bouton 'addTaskBtn'
addTaskBtn.addEventListener("click", () => {
  // Si une tâche est actuellement sélectionnée pour la modification
  if (selectedTaskId !== null) {
    // Éditer la tâche avec les nouvelles valeurs saisies par l'utilisateur
    tracker.editTask(selectedTaskId, titleInput.value, descriptionInput.value);

    // Sauvegarder la liste de tâches mise à jour dans le localStorage
    tracker.saveList();

    // Réinitialiser ID de la tâche sélectionnée et le texte du bouton
    selectedTaskId = null;
    addTaskBtn.textContent = "Add task";
  } else {
    // Si aucune tâche n'est sélectionnée pour la modification, ajouter une nouvelle tâche
    tracker.addTask(titleInput.value, descriptionInput.value);

    // Sauvegarder la liste de tâches
    tracker.saveList();
  }

  // Effacer les valeurs dans les champs d'entrée
  titleInput.value = "";
  descriptionInput.value = "";
});

// Sauvegarder les valeurs des champs d'entrée dans le localStorage quand ils changent
titleInput.addEventListener("change", () => {
  localStorage.setItem("title", titleInput.value);
});
descriptionInput.addEventListener("change", () => {
  localStorage.setItem("description", descriptionInput.value);
});

// Restaurer les valeurs des champs d'entrée quand la page est rechargée
const storedTitle = localStorage.getItem("title");
const storedDescription = localStorage.getItem("description");
if (storedTitle) {
  titleInput.value = storedTitle;
}
if (storedDescription) {
  descriptionInput.value = storedDescription;
}
