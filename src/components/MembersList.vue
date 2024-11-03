<template>
    <div class="page-wrapper flex flex-col justify-center items-center h-fit">
        <div
            v-if="Object.keys(groupedMembersByWeek).length > 0"
            class="flex flex-col w-4/5 h-fit min-h-screen mx-auto my-12 p-12 rounded-md"
        >
            <div
                v-for="(group, index) in groupedMembersByWeek"
                :key="group.week"
                class="group-card flex flex-col p-4 m-2 rounded-md justify-center"
            >
                <p class="text-gray-900 text-3xl">{{ group.year }}, vecka {{ group.week }}:</p>

                <hr class="border border-gray-900 w-full mb-4">
                <div
                    v-for="member in group.members"
                    :key="member.id"
                    class="member-card flex flex-col p-6 m-4 rounded-md justify-center relative"
                >
                    <p class="text-gray-900 text-2xl">
                        <button class="hover:text-gray-200" @click="copyNameToClipboard(member)">
                            Namn: {{ member.firstname }} {{ member.lastname }}
                        </button>
                    </p>

                    <p class="text-gray-900 text-2xl">
                        <button class="hover:text-gray-200" @click="copyEmailToClipboard(member)">
                            Email: {{ member.email }}
                        </button>
                    </p>

                    <div class=" text-white p-2 rounded-md absolute right-0 mx-auto flex flex-col">
                        <button class="bg-black text-white p-2 rounded-md mb-1">
                            <router-link
                                :to="`/edit/${member.id}`"
                                class="hover:text-gray-300"
                            >
                                Editera
                            </router-link>
                        </button>

                        <button
                            class="bg-black text-white p-2 rounded-md mt-1"
                            @click="deleteMember(member.id, index)"
                        >
                            Ta bort
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="min-h-screen">
            <p class="text-white mt-12 text-3xl">Inga medlemmar hittades</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const members = ref([]);
const groupedMembersByWeek = ref([]);

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:3000/members');
        members.value = response.data;
        groupedMembersByWeek.value = computeGroupedMembers();
    } catch (error) {
        console.error('Error fetching members:', error);
    }
});

const getWeekNumber = (d) => {
    // Copy date so don't modify original
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
    // Get first day of year
    var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    return [d.getUTCFullYear(), weekNo];
}

function computeGroupedMembers() {
    const grouped = members.value.reduce((acc, member) => {
        const yearWeek = getWeekNumber(new Date(member.created_at));
        const year = yearWeek[0];
        const week = yearWeek[1];
        const weekKey = `${year}-${week}`;
        if (!acc[weekKey]) {
            acc[weekKey] = { year, week, members: [] };
        }
        acc[weekKey].members.push(member);
        return acc;
    }, {});

    // Convert the object into an array and sort by year and week descending
    return Object.values(grouped).sort((a, b) => {
        if (a.year === b.year) {
            return b.week - a.week;
        }
        return b.year - a.year;
    });
}

const deleteMember = async (id, index) => {
    if (confirm('Är du säker på att du vill ta bort medlemmen?')) {
        try {
            await axios.delete(`http://localhost:3000/members/${id}`);
            groupedMembersByWeek.value[index].members = groupedMembersByWeek.value[index].members.filter(member => member.id !== id);
        } catch (error) {
            console.error('Error deleting member:', error);
            alert('Kunde inte ta bort medlem');
        }
    }
}

const copyNameToClipboard = (member) => {
    navigator.clipboard.writeText(member.firstname + ' ' + member.lastname);
}

const copyEmailToClipboard = (member) => {
    navigator.clipboard.writeText(member.email);
}
</script>
