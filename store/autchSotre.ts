import { defineStore } from "pinia";

interface autchStoreFields {
    email: string,
    name: string, 
    status: boolean,
}

const deffaultValue: {user: autchStoreFields} = {
    user:{

        email: '',
        name: '',
        status: false,
    }
}

export const UseAuthStore = defineStore(' auth',{
    state: () => deffaultValue,
    getters: {
        isAuth: state => state.user.status,
        myName: state => state.user.name,
        
    },
    actions: {
        clear(){
            this.$patch(deffaultValue)
        },
        set(input:autchStoreFields){
            this.$patch({user:input})
        }
    }
})