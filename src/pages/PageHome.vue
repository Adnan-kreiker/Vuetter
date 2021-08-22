<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class=" q-my-lg q-mx-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            bottom-slots
            v-model="newVueetContent"
            placeholder="What is happening?"
            counter
            maxlength="283"
            autogrow
            class="newVueet"
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="../assets/my-photo.jpg" />
              </q-avatar>
            </template>
            <template v-slot:after> </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            unelevated
            rounded
            color="primary"
            :disable="!newVueetContent"
            no-caps
            label="Vueet"
            class="q-mb-lg"
            @click="addNewVueet"
          />
        </div>
      </div>
      <q-separator size="10px" color="grey-2" class="divider" />

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item v-for="vueet in vueets" :key="vueet.id" class="q-py-md">
            <q-item-section avatar top>
              <q-avatar>
                <img src="../assets/my-photo.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1"
                ><strong>Adnan Kreiker</strong>
                <span class="text-grey-7 "
                  >@adnan__kreiker <br class="lt-md" />
                  {{ formattedDate(vueet.date) }}</span
                >
                &bull;
              </q-item-label>
              <q-item-label class="text-body1 vueet-content">
                {{ vueet.content }}
              </q-item-label>
              <div class="vueet-icons row justify-between q-mt-sm">
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="far fa-comment"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="fas fa-retweet"
                />
                <q-btn
                  @click="toggleLiked(vueet)"
                  flat
                  round
                  :color="vueet.liked ? 'red' : 'grey'"
                  size="sm"
                  :icon="vueet.liked ? 'fas fa-heart' : 'far fa-heart'"
                />
                <q-btn
                  @click="deleteVueet(vueet)"
                  flat
                  round
                  color="grey"
                  size="sm"
                  icon="fas fa-trash"
                />
              </div>
            </q-item-section>
            <q-item-section side top> </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import db from "src/boot/firebase";
import { formatDistance } from "date-fns";
import { defineComponent } from "vue";

export default defineComponent({
  name: "PageHome",
  data() {
    return {
      newVueetContent: "",
      vueets: [
        // {
        //   id: "1",
        //   content:
        //     "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus, minus. Sapiente dolor aliquid cumque quam eos, cum quasi distinctio exad quod sed placeat, obcaecati unde deleniti voluptates beatae odit?",
        //   date: 1729617674222,
        //   liked: false
        // },
        // {
        //   id: "2",
        //   content:
        //     "Lorem ipsum dolors, sit amet consectetur adipisicing elit. Possimus, minus. Sapiente dolor aliquid cumque quam eos, cum quasi distinctio exad quod sed placeat,  obcaecati unde deleniti voluptates beatae odit?",
        //   date: 1629617674222
        // },
        // {
        //   id: "3",
        //   content:
        //     "Lorem ipsum dolors, sit amet consectetur adipisicing elit. Possimus, minus. Sapiente dolor aliquid cumque quam eos, cum quasi distinctio exad quod sed placeat,  obcaecati unde deleniti voluptates beatae odit?",
        //   date: 1629620660215,
        //   liked: true
        // }
      ]
    };
  },
  mounted() {
    db.collection("vueets")
      .orderBy("date", "asc")
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          let vueetChange = change.doc.data();
          vueetChange.id = change.doc.id;
          if (change.type === "added") {
            // whenever someone updates the db, the changes are reflected in our page
            this.vueets.unshift(vueetChange);
          }
          if (change.type === "modified") {
            console.log("Modified city: ", vueetChange);
            let index = this.vueets.findIndex(
              vueet => vueet.id === vueetChange.id
            );
            Object.assign(this.vueets[index], vueetChange);
          }
          if (change.type === "removed") {
            this.vueets = this.vueets.filter(
              vueet => vueet.id != vueetChange.id
            );
            console.log("Removed city: ", vueetChange);
          }
        });
      });
  },
  methods: {
    formattedDate(date) {
      return formatDistance(date, new Date(), { addSuffix: true });
    },
    toggleLiked(vueet) {
      console.log(vueet);
      vueet.liked = !vueet.liked;
      const vueetRef = db.collection("vueets").doc(vueet.id);

      // Set the "capital" field of the city 'DC'
      return vueetRef
        .update({
          liked: vueet.liked
        })
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch(error => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });
    },
    addNewVueet() {
      const vueet = {
        content: this.newVueetContent,
        date: Date.now(),
        liked: false
      };
      db.collection("vueets")
        .add(vueet)
        .then(docRef => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch(error => {
          console.error("Error adding document: ", error);
        });
      this.newVueetContent = "";
    },
    deleteVueet(vueet) {
      // we have to pass the doc.id as an argument for doc()
      db.collection("vueets")
        .doc(vueet.id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch(error => {
          console.error("Error removing document: ", error);
        });
    }
  }
});
</script>

<style lang="sass" scoped>
.newVueet
   textarea
    font-size: 19px
    line-height: 1.4
.divider
  border-bottom: 1px solid
  border-top: 1px solid
  border-color: $grey-4
.vueet-content
  white-space: pre-line
.vueet-icons
  margin-left: -5px
</style>
