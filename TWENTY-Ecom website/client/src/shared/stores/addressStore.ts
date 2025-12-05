import { defineStore } from "pinia";
import { createAddress, deleteAddress, editAddress, getUserAddresses } from "../services/address.service";
import type { AddressInterface } from "@/shared/interfaces/address.interface";

interface AddressState {
  addresses: AddressInterface[];
  addressDefault: String;
  error: any;
}

export const useAddress = defineStore("address", {
  state: (): AddressState => ({
    addresses: [], // Initialize addresses as an empty array
    addressDefault: "",
    error: null,
  }),

  actions: {
    async createAddress(addressData: AddressInterface) {
      try {
        const newAddress = await createAddress(addressData);

        // Update the store
        this.error = null;
        this.addresses.push(newAddress);
      } catch (error) {
        this.error = error;
      }
    },

    async getUserAddresses() {
      try {
        const addresses = await getUserAddresses();
        this.addresses = addresses;
        this.addressDefault = this.getAddressFormated(0);
        this.error = null;
      } catch (error) {
        this.error = error;
      }
    },

    getAddressFormated(n: number): string {
      return this.addresses[n].numberAddress + " " + this.addresses[n].streetAddress + " " + this.addresses[n].postCode;
    },

    async deleteAddress(indexAddress: number) {
      try {
        // Use the axios function to delete the address
        await deleteAddress(indexAddress);

        // Update the addresses in the store by filtering out the deleted address
        this.addresses = this.addresses.filter((address, index) => index !== indexAddress);
        this.error = null;
      } catch (error) {
        this.error = error;
      }
    },

    async editAddress(index: number, addressData: AddressInterface) {
      try {
        await editAddress(index, addressData);
        // Update the addresses in the store (assuming the response from the server includes the updated address)
        this.addresses = this.addresses.map((address) => {
          if (address._id === addressData._id) {
            return addressData;
          }
          return address;
        });
      } catch (error) {
        this.error = error;
      }
    },
  },
});
