import type { Website } from "@/types/Other";
import { defineStore } from "pinia";

type Actions = {
   setWebsiteInfo: (data: Website) => void
}
type Getter = {}

export const useWebsiteStore = defineStore<string, Website, Getter, Actions>("website_store", {
   state() {
      return {
         logoUrl: "",
         name: "",
         info: "",
      }
   },
   actions: {
      setWebsiteInfo(website: Website) {
         this.logoUrl = website.logoUrl;
         this.name = website.name;
         this.info = website.info;
      }
   }
});