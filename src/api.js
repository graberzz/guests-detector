import firebase from 'firebase'
import axios from 'axios'

const config = {
    apiKey: "AIzaSyAzbLKtGmP2-HOUH70gSVx8EeN8W4rcaUc",
    authDomain: "discussion-helper.firebaseapp.com",
    databaseURL: "https://discussion-helper.firebaseio.com",
    projectId: "discussion-helper",
    storageBucket: "discussion-helper.appspot.com",
    messagingSenderId: "704104783451"
  };

firebase.initializeApp(config)

const db = firebase.firestore()

export const getStalkers = async ({ id }) => {
    const querySnapshot = await db.collection('stalkers').where('victim', '==', id).get()
    const stalkers = []

    querySnapshot.forEach(doc => {
        stalkers.push(doc.data())
    })

    return stalkers
}

export const getAllStalkersByVictim = async () => {
    const querySnapshot = await db.collection('stalkers').get()
    const stalkers = []

    querySnapshot.forEach(doc => {
        stalkers.push(doc.data())
    })


    const obj = stalkers.reduce((obj, stalker) => {
        if (!stalker.victim) return obj

        if (obj[stalker.victim]) {
            obj[stalker.victim].push(stalker)
        } else {
            obj[stalker.victim] = [stalker]
        }
        return obj
    }, {})

    return obj
}

export const addStalker = async ({ id, stalkerInfo }) => {
    db.collection('stalkers').add({
        victim: id,
        ts: Date.now(),
        ...stalkerInfo,
    })

    axios.post('https://calm-dawn-98482.herokuapp.com/notify', {
        id,
        message: `Тебя посетил${stalkerInfo.sex === 1 ? 'а' : ''} ${stalkerInfo.first_name} ${stalkerInfo.last_name}`
    })
}