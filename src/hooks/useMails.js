/*
 In this file i have created a custom hook to handle real-time firebase functionality so that i don't have to write the same logic again, i can resue the same code in multiple components wherever required.
*/

import { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase'; // imported db instance

export const useMails = (folder, cleanEmail) => {
  const [mails, setMails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //ref() tells firebase exactly where to look in the database
    const mailRef = ref(db, `${folder}/${cleanEmail}`);

    // onValue is a real-time listener
    // snapshot is like a screenshot of data at that moment
    const unsubscribe = onValue(mailRef, (snapshot) => {
      //Extracts actual data stored at that location
      const data = snapshot.val();

      //If data is not found then it sets mails to empty array and loading to false
      if (!data) {
        setMails([]);
        setLoading(false);
        return;
      }

      //Convert objects to array of objects
      const loadedMails = Object.entries(data).map(([id, mail]) => ({
        id,
        ...mail,
      }));

      //Sorts mail in descending order based on date and time (To show latest first)
      loadedMails.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setMails(loadedMails);
      setLoading(false);
    });

    // detach listener when component unmounts
    return () => unsubscribe();
  }, [folder, cleanEmail]);

  // Returning the state (values) required in other components.
  return { mails, loading };
};
