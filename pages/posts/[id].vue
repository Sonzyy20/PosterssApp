<script setup lang="ts">
import { useRoute } from "#app";
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
const post = ref(null);
const comments = ref<any>([]);
const route = useRoute();
const postId = route.params.id;
const Astore = UseAuthStore();
const documentData = ref<null | object>(null);

const fethPosts = async () => {
  try {
    const result = await database.listDocuments(
      "6728f84b000008442afe", // databaseId
      "6728f8580020cd8ac5b8", // collectionId
      [] // queries (optional)
    );
    const data = await result;
    // console.log(JSON.stringify(data))
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
    console.log("db ID", DB_ID)
    await database.createDocument(
      DB_ID as string,
      COLLECTION_COMMENTS as string,
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

const fetchComments = async () => {
  try {
    const result = await database.listDocuments(DB_ID, COLLECTION_COMMENTS, [
      Query.equal("postId", `${postId}`),
    ]);

    const data = await result;
    comments.value = data.documents;

    console.log(postId);
    console.log("comment fetched");
    console.log(comments.value.length);
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  loadStore.pendingStatus(true);
  await fethPosts();
  await fetchComments();
  loadStore.pendingStatus(false);
});
onMounted(() => {
  client.subscribe(
    [
      `databases.${DB_ID}.collections.${COLLECTION_COMMENTS}.documents`,
      "files",
    ],
    (response) => {
      // Callback will be executed on changes for documents A and all files.
      console.log(response);
      documentData.value = response.payload as object;
      // console.log(response.payload.title)
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
          console.log("post added");
        }
      };

      if (isCreateEvent) {
        console.log("Документ был добавлен:", response.payload);
      } else if (isDeleteEvent) {
        console.log("Документ был удален:", response.payload);
      } else if (isUpdateEvent) {
        console.log("Документ был обновлен:", response.payload);
      } else {
        console.log("Неизвестное событие:", response.events);
      }
      if (isCreateEvent) {
        filterAdd(documentData.value);
      }
      // console.log(documentData.value.title)
    }
  );
});

const filterRemoveComments = (commentData) => {
  // Находим комментарий
  const comment = comments.value.find((comment) => comment.$id === commentData);
  
  if (commentIndex !== -1) {
    // Устанавливаем флаг, что элемент удаляется
    comments.value[commentIndex].isRemoving = true;

    // После анимации удаляем комментарий
    setTimeout(() => {
      comments.value.splice(commentIndex, 1);
    }, 500); // Задержка равна времени анимации
  }
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
              v-model="commentContent"
              placeholder="Type your comment here here."
            />
            <UiButton type="button" @click="leftComment">Send message</UiButton>
          </div>
          <div v-if="comments.length != 0" class="w-[80%] h-full">
            <transition-group name="fade" tag="div" class="container">
            
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-leave-active {
  position: absolute;  /* Убирает элемент из потока */
  width: 100%;  /* Сохраняет ширину для анимации */
  z-index:-1;
}
.comment {
  position: relative; /* Можно использовать absolute, если нужно, чтобы избежать наложений */
  z-index: 1;
}
</style>
