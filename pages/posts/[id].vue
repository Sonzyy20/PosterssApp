<script setup lang="ts">
// import { useRoute } from "#app";
import { onMounted } from "vue";
import { database } from "../../lib/appwrite";
import { Query } from "appwrite";
import { ref } from "vue";
import { client } from "../../lib/appwrite";
// import { DB_ID, COLLECTION_COMMENTS } from "~/lib/app.constants";
import CommentsCard from "~/components/CommentsCard.vue";
import { UseAuthStore } from "~/store/authStore";
import { UsePendingStore } from "~/store/pendingStore";
const {DB_ID, COLLECTION_POSTS, COLLECTION_COMMENTS} = useRuntimeConfig().public;
const loadStore = UsePendingStore();

const commentContent = ref("");
const posts = ref<any>([]);
const post = ref<object | null>(null);
const comments = ref<any>([]);
const route = useRoute();
const postId = route.params.id;
const Astore = UseAuthStore();
const documentData = ref<null | object>(null);
// let commentInput = document.getElementById("commentInput");
interface Post{
  title: string,
  content: string,
  userId: string,
  createdAt: string,
  username:string,
  $id: string,
}


const fethPosts = async () => {
  try {
    const result = await database.listDocuments(
      "6728f84b000008442afe", // databaseId
      "6728f8580020cd8ac5b8", // collectionId
      [] // queries (optional)
    );
    const data = await result;
    
    posts.value = data.documents;
   

    post.value = posts.value.find((post) => post.$id === postId);
  } catch (error) {
    console.log("Problem: ", error);
  }
};

const leftComment = async () => {
  if (!commentContent.value.trim()) {
    alert("u dont input comment text");
    return;
  }

  try {
    const postComId = postId.toString();
    await database.createDocument(
      DB_ID,
      COLLECTION_COMMENTS,
      "unique()",
      {
        userId: Astore.userId,
        postId: postId,
        createdAt: new Date().toISOString(),
        userName: Astore.myName,
        content: commentContent.value,
      }
    );
    commentContent.value = "";
  } catch (error) {
    console.log(error);
  }
};

onMounted(()=>{


})

const fetchComments = async () => {
  try {
    const result = await database.listDocuments(DB_ID, COLLECTION_COMMENTS, [
      Query.equal("postId", `${postId}`),
    ]);
    
    const data = await result;
    comments.value = data.documents;
    
    
  } catch (error) {
    console.log(error, "problem with fetching");
    console.log(postId)
    console.log(COLLECTION_COMMENTS)
    console.log(DB_ID)
    console.log()
  }
};

onMounted(async () => {
  loadStore.pendingStatus(true);
  await fethPosts();
  await fetchComments();
  loadStore.pendingStatus(false);
  nextTick(()=>{

  if(typeof window !== "undefined"){
    
    const commentInput = document.getElementById("commentInput") as HTMLInputElement | null;
   
    if (commentInput) {
      commentInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          
          document.getElementById("commentButton")?.click();
        }
      });
    }
  }
});
});
onMounted(() => {
  client.subscribe(
    [
      `databases.${DB_ID}.collections.${COLLECTION_COMMENTS}.documents`,
      "files",
    ],
    (response) => {
      // Callback will be executed on changes for documents A and all files.
     
      documentData.value = response.payload as object;
      
      const isCreateEvent = response.events.some((event) =>
        event.includes(".create")
      );
      const isDeleteEvent = response.events.some((event) =>
        event.includes(".delete")
      );
      const isUpdateEvent = response.events.some((event) =>
        event.includes(".update")
      );
      const filterAdd = (comment: object) => {
        if (
          !comments.value.some(
            (existingComment) => existingComment.$id === postId
          )
        ) {
          comments.value.push(comment);
          
        }
      };
      if (isCreateEvent) {
        filterAdd(documentData.value);
      }
      
    }
  );
});

const filterRemoveComments = (commentData: string) => {
  // Находим комментарий
  const comment = comments.value.find((comment) => comment.$id === commentData);
  
  const commentElement = document.getElementById(`comment-${commentData}`);
  if (commentElement) {
    const rect = commentElement.getBoundingClientRect();
    commentElement.style.position = "absolute";
    commentElement.style.width = `${rect.width}px`;
    commentElement.style.height = `${rect.height}px`;
    commentElement.style.left = `${rect.left}px`;
  }




    comment.isRemoving = true; // Флаг для начала анимации
    setTimeout(() => {
      // Удаляем комментарий после анимации
      comments.value = comments.value.filter((comment: Post) => comment.$id !== commentData);
    }, 2000); // Время анимации
  
};



</script>
<template>
  <div v-if="loadStore.isPending === true">LOAD</div>
  <div v-else>
    <div v-if="post" class="w-full">
      <div
        class="wrapper w-[80%] flex justify-between mx-auto flex-col"
        v-if="post"
      >
        <div class="flex justify-center flex-col w-full items-center">
          <div class="Top w-[80%] flex items-center justify-between mb-1">
            <h4 class="absolute text-gray-400">{{ post?.userName }}</h4>
            <div class="flex-1 text-center uppercase font-extrabold">
              {{ post?.title }}
            </div>
          </div>
          <div class="border border-gray-300 w-[80%] h-[1px]"></div>
          <div class="mt-4 mainContent w-[80%]">
            <div>{{ post?.content }}</div>
            <div class="border border-gray-400 mt-10"></div>
          </div>
          <div class="grid w-[80%] gap-2 mt-5 mb-7">
            <UiTextarea
            id="commentInput"
              v-model="commentContent"
              placeholder="Type your comment here here."
            />
            <UiButton id="commentButton" type="button" @click="leftComment">Send message</UiButton>
          </div>
          <div v-if="comments.length != 0" class="w-[80%] h-full">
            <transition-group name="fade" tag="div" class="container" mode="default">
            
              <CommentsCard
              @udateCommentsList = "filterRemoveComments"
              v-for="comment in comments"
              :key="comment.$id"
              :comment="comment"
              :id="`comment-${comment.$id}`"
              :class="['comment', { 'fade-leave-active': comment.isRemoving }]"
              />
            </transition-group>
          </div>
          <div v-else>No comments here</div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="w-full h-[500px] flex flex-col justify-center items-center flex-wrap"
    >
      <P class="text-red-600 text-8xl">ERROR #404</P>
      <p class="uppercase font-bold">Conten not fined</p>
    </div>
  </div>
</template>

<style scoped>
@keyframes smoothMoveUp {
  0% {
    transform: translateY(5px);
  }
  40% {
    transform: translateY(-3px);
  }
  100% {
    transform: translateY(0);
  }
}



.fade-enter-active,
.fade-leave-active {
  transition: max-height 0.5s ease, opacity 0.5s ease;
  overflow: hidden;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
  opacity: 0;
  transform: translateY(-20px);
}
.fade-move {
  transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.5s ease;
}
.comment {
  position: relative; /* Можно использовать absolute, если нужно, чтобы избежать наложений */
  z-index: 1;
}
</style>
