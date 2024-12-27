import { defineStore } from "pinia";

export const UsePendingStore = defineStore('pending', {
    state: () => ({itIsPending:false}),

    getters: {
        isPending: state => state.itIsPending
    },

    actions:{
        pendingStatus(newStatus: boolean){
           
            this.itIsPending = newStatus
        }
    }
})
