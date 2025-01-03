 <script lang="ts" setup>
    import { UseAuthStore } from '~/store/authStore';
    const AStore = UseAuthStore();

 </script>
  <template>
    <div>
     <UiDropdownMenu>
     <UiDropdownMenuTrigger><UiButton class="bg-slate-50 text-black border-black border-2"  >{{ AStore.myName }}</UiButton>  </UiDropdownMenuTrigger>
     <UiDropdownMenuContent>
       <UiDropdownMenuLabel>My Account</UiDropdownMenuLabel>
       <UiDropdownMenuSeparator />
       <UiDropdownMenuItem>Profile</UiDropdownMenuItem>
       <UiDropdownMenuItem>Billing</UiDropdownMenuItem>
       <UiDropdownMenuItem>Team</UiDropdownMenuItem>
       <UiDropdownMenuItem><span>Log Out</span></UiDropdownMenuItem>
     </UiDropdownMenuContent>
   </UiDropdownMenu>
      
    </div>
  </template>
 <style>
 
 </style>