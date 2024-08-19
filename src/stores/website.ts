import type { Website } from "@/types/Other";
import { defineStore } from "pinia";

type Actions = {
   setWebsiteInfo: (data: Website) => void
}
type Getter = {}

export const useWebsiteStore = defineStore<string, Website, Getter, Actions>("website_store", {
   state() {
      return {
         id: 0,
         logoUrl: "",
         name: "",
         info: "",
      }
   },
   actions: {
      setWebsiteInfo(website: Website) {
         this.id = website.id;
         this.logoUrl = website.logoUrl;
         this.name = website.name;
         this.info = website.info;
      }
   }
});