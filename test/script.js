var myHeaders = new Headers();
myHeaders.append("User-Agent", "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:121.0) Gecko/20100101 Firefox/121.0");
myHeaders.append("Accept", "application/json, text/plain, */*");
myHeaders.append("Accept-Language", "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3");
myHeaders.append("Accept-Encoding", "gzip, deflate, br");
myHeaders.append("Origin", "https://intra.etna-alternance.net");
myHeaders.append("Connection", "keep-alive");
myHeaders.append("Referer", "https://intra.etna-alternance.net/");
myHeaders.append("Cookie", "authenticator=eyJpZGVudGl0eSI6ImV5SnBaQ0k2TkRFME56QXNJbXh2WjJsdUlqb2laM0psYm5SbFgyY2lMQ0psYldGcGJDSTZJbWR5Wlc1MFpWOW5RR1YwYm1FdFlXeDBaWEp1WVc1alpTNXVaWFFpTENKc2IyZGhjeUk2Wm1Gc2MyVXNJbWR5YjNWd2N5STZXeUp6ZEhWa1pXNTBJbDBzSW14dloybHVYMlJoZEdVaU9pSXlNREkwTFRBeExUSTJJREE1T2pRd09qVTNJbjA9Iiwic2lnbmF0dXJlIjoiem9FSjJjcEpaVnVcL3BwM0ZFcnI1Z1p4eXVVVkNhR2hENU9Wa3lhcHJNTzV6K2pzbG80VDNjXC9YT2EybSthZGU1RmdCeU53V1JUaXBiNzh3OVwvZmxxaVwvWUtrNVk0a0QwblQ5d3pBZzN1cGxoQ29nY1NTajFxVkFtN1I0T1wvTWg4SGFnYUJnZUJweVhqK0QzN2RxZU9hRUFxa0RUNzFTb0JTaW1Ea3NvXC9PNmduRG0rRW5SVVd4eEZoVXVTK2oyNWw0R0ViVFh2cTd1eCtkOXVIU1lLVkN5VjJldDNBZ29xaXhvdk1NWkJ3RTI3OEJ4MUJER1YwUCtYSFlvQ1FOeDZKdlwvbmpwN0p2blNRNk9UT3c3K1hKVDVaeXhOUEVncXRUTnEwTEFrcWNvcldDUkx2bmZOMSszUytFS1VrVk9GVEFyZ1MyXC9tYkdcLys1TE5ZWVVsSnF5UTRcL1JHUkNyRDE3VjU0SlRlU1NlcmpmbFpZRkFzMENOTHZLXC9FMW5oXC9qOUNVTFhxNDArQmVcL1pSK1p0cTZUWktRMEpQQUJRalwveVZEQlJ1UERLMVdJRjZSOGFuUVhJcE04cmtqc3R4MDRiV01aWWc2aHJVRU1CUlhPajdTXC82aU44TFdITWw5d081U1c4NHdPRzlJbXpkSk9iVWlMb1ZSSEZWK3dmSVpLUzFQTmR4RWY1VHg2MVJWNGk1QTYzRUxJY0dVb1pcL2dxZmhcL043UDNUeHNqT28reUMyT0tQbjZNSDdmSzVUQXE4Z2hEQUttaVFKN24wbHZRSlRSWHB0RnRCSFJvMVRvWUVPNTBFWXF0ejNiS3NIUTExZ1BOWGlcL3M0QklaanhaanBHK0JsVms2QlNcL3hiWXhob2s2Yjd4aEZuYXdLZHhlTzMzbkJ3QUZcLzVGQjFaNGVBZz0ifQ%3D%3D");
myHeaders.append("Sec-Fetch-Dest", "empty");
myHeaders.append("Sec-Fetch-Mode", "cors");
myHeaders.append("Sec-Fetch-Site", "same-site");

var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};


const unsorted = new Object();
const ranked = [];
async function main() {

    const result = await fetch("https://prepintra-api.etna-alternance.net/trombi/819", requestOptions);
    const json = await result.json();
    const logins = json.students.map(st => st.login);
    for (const login of logins) {
        const result = await fetch(`https://prepintra-api.etna-alternance.net/terms/819/students/${login}/marks`, requestOptions);
        const json = await result.json();
        const marks = json.map(project => project.student_mark < 0 ? 0 : project.student_mark)
        const coefs = json.map(project => project.activity_coefficient < 0 ? 0 : project.activity_coefficient)
        const moyenne = calculerMoyennePonderee(marks, coefs);

        unsorted[login] = moyenne;

    }

    console.log(Object.entries(unsorted).length);
    const sortable = Object.fromEntries(
        Object.entries(unsorted).sort(([, a], [, b]) => b - a)
    );
    for (const [key, value] of Object.entries(sortable)) {
        ranked.push([key, value]);
    }

    console.table(ranked)

}

main();


function calculerMoyennePonderee(valeurs, poids) {
    if (valeurs.length !== poids.length) {
        throw new Error("Le nombre de valeurs doit être égal au nombre de poids.");
    }

    const sommeProduitsPonderees = valeurs.reduce((acc, valeur, index) => {
        return acc + valeur * poids[index];
    }, 0);

    const sommePoids = poids.reduce((acc, poids) => acc + poids, 0);

    const moyennePonderee = sommeProduitsPonderees / sommePoids;
    return moyennePonderee;
}

