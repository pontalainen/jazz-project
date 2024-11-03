<template>
    <div class="page-wrapper flex flex-col items-center h-screen">
        <img src="../assets/logo.png" alt="logo" class="w-52 mb-4">
        <h2 v-if="success" class="text-black text-4xl -mt-12 mb-2">
            Medlem sparad!
        </h2>
        <div
            class="flex flex-col w-4/5 h-3/5 mx-auto p-12 border-4 border-black rounded-md"
        >
            <form
                class="flex flex-col justify-between h-full"
                @submit.prevent="handleSubmit"
            >
                <div
                    v-for="detail in memberDetails"
                    :key="detail.title"
                    class="flex flex-col p-4 rounded-md"
                >
                    <label
                        :for="detail.title"
                        class="text-black underline text-2xl mb-1"
                    >
                        {{ detail.title }}:
                    </label>

                    <input
                        v-model="detail.value"
                        type="text"
                        :id="detail.title"
                        :name="detail.title"
                        class="border border-gray-700 rounded-md p-4 text-xl"
                        :placeholder="detail.title"
                        :required="detail.title !== 'Email'"
                    >
                </div>
                
                <button
                    type="submit"
                    class="my-4 p-4 w-1/3 mx-auto bg-black text-white rounded-md"
                    :disabled="loading"
                >
                    Spara
                </button>
            </form>    
        </div>
    </div>
</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
    id: {
        type: String,
        required: false,
    },
});

const memberDetails = ref({
  firstname: {
    title: 'Förnamn',
    value: '',
  },
  lastname: {
    title: 'Efternamn',
    value: '',
  },
  email: {
    title: 'Email',
    value: '',
  },
});

const loading = ref(false);
const success = ref(false);

onMounted(() => {
    if (props.id) {
        getMember();
    }
});

const getMember = async () => {
    try {
        const url = `http://localhost:3000/members/${props.id}`;
        const response = await axios.get(url);
        const { firstname, lastname, email } = response.data;

        memberDetails.value.firstname.value = firstname;
        memberDetails.value.lastname.value = lastname;
        memberDetails.value.email.value = email;
    } catch (error) {
        console.error(error);
    }
};

const handleSubmit = () => {
    loading.value = true;
    const memberValues = Object.keys(memberDetails.value).reduce((acc, key) => {
        acc[key] = memberDetails.value[key].value;
        return acc;
    }, {});

    if (props.id) {
        updateMember(memberValues);
    } else {
        saveMember(memberValues);
    }
};

const saveMember = async (data) => {
    const url = 'http://localhost:3000/save';
    try {
        await axios.post(url, data);
        handleSuccess();
    } catch (error) {
        console.error(error);
        alert(error.response.data.error);
    } finally {
        loading.value = false;
    }
};

const updateMember = async (data) => {
    const url = `http://localhost:3000/update/${props.id}`;
    try {
        await axios.post(url, data);
        handleSuccess();
    } catch (error) {
        console.error(error);
        alert(error.response.data.error);
    } finally {
        loading.value = false;
    }
};

const handleSuccess = () => {
    success.value = true;
    setTimeout(() => {
        success.value = false;
    }, 5000);
};
</script>