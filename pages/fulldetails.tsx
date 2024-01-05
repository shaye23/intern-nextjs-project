import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query ,doc,updateDoc,setDoc,addDoc} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';
const Fulldetails = () => {
  const router = useRouter();
  const { eventType, id } = router.query;

  const eventTypeArray = Array.isArray(eventType) ? eventType : [eventType];

  const [assignedPersonsusers, setAssignedPersonsusers] = useState<any>([]);
  const [assignedPersonsevents, setAssignedPersonevents] = useState<any>([]);
  const [checkedItems, setCheckedItems] = useState<
    Array<{ started: boolean; pending: boolean; finished: boolean; assignedPerson: string }>
  >(eventTypeArray.map(() => ({ started: false, pending: false, finished: false, assignedPerson: '' })));

  const [paymentStatusArray, setPaymentStatusArray] = useState<Array<string>>([]);
  const [notesArray, setNotesArray] = useState<Array<string>>([]);

  useEffect(() => {
    const fetchDatausers = async () => {
      try {
        const usersQuery = query(collection(db, 'users'));
        const querySnapshot = await getDocs(usersQuery);
        const data: any = [];

        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });

        setAssignedPersonsusers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchDatausers();
  }, []);

  useEffect(() => {
    const fetchDataevent = async () => {
      try {
        const usersQuery = query(collection(db, 'eventuser'));
        const querySnapshot = await getDocs(usersQuery);
        const data: any = [];

        querySnapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });

        console.log('events', data);
        setAssignedPersonevents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchDataevent();
  }, []);

  const handleCheckboxChange = (rowIndex: number, column: string) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems: any = [...prevCheckedItems];

      // Check if the row exists before updating it
      if (newCheckedItems[rowIndex]) {
        newCheckedItems[rowIndex] = {
          ...newCheckedItems[rowIndex],
          [column]: !newCheckedItems[rowIndex][column],
        };
      } else {
        // If the row doesn't exist, create a new row object
        newCheckedItems[rowIndex] = {
          started: false,
          pending: false,
          finished: false,
          [column]: true,
        };
      }

      return newCheckedItems;
    });
  };

  const handleAssignedPersonChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    rowIndex: number,
    assignedPersonsForType: any[]
  ) => {
    setCheckedItems((prevCheckedItems) => {
      const newCheckedItems = [...prevCheckedItems];
      newCheckedItems[rowIndex] = {
        ...newCheckedItems[rowIndex],
        assignedPerson: e.target.value,
      };
      return newCheckedItems;
    });
  };

  const handlePaymentStatusChange = (e: any, rowIndex: number) => {
    const newPaymentStatusArray = [...paymentStatusArray];
    newPaymentStatusArray[rowIndex] = e.target.value;
    setPaymentStatusArray(newPaymentStatusArray);
  };

  const handleNotesChange = (e: any, rowIndex: number) => {
    const newNotesArray = [...notesArray];
    newNotesArray[rowIndex] = e.target.value;
    setNotesArray(newNotesArray);
  };
 
  const handleSave = async () => {
    try {
      // Create a unique ID for the document (you can use uuid or any other method)
      const documentId = uuidv4();

      // Construct the data object for the document
      const eventData = eventTypeArray.map((eventType, index) => ({
        eventType,
        assignedPerson: checkedItems[index]?.assignedPerson || '',
        started: checkedItems[index]?.started || false,
        finished: checkedItems[index]?.finished || false,
        paymentStatus: paymentStatusArray[index] || '',
        notes: notesArray[index] || '',
      }));

      // Save the document to the Firestore collection (replace 'yourCollection' with your actual collection name)
      await setDoc(doc(db, 'fulldetails', documentId), {
        events: eventData,
      });

      // Show success message (you can customize this according to your UI)
      toast.success('Details saved successfully!');
    } catch (error) {
      console.error('Error saving details:', error);
      // Show error message (you can customize this according to your UI)
      toast.error('Error saving details. Please try again.');
    }
  };
  
  
  return (
    <div className="container mx-auto p-4 py-6">
      <h1 className="text-2xl font-bold mb-4 space-x-2 py-4">Event Details</h1>
      <div>
        {assignedPersonsevents
          .filter((event: any) => event.id === id)
          .map((event: any, index: any) => (
            <div key={index}>
              <p>Event Name: {event.eventName}</p>
              <p>Date: {event.date}</p>
              <p>Venue: {event.venue}</p>
              <p>Contact: {event.contact}</p>
             
            </div>
          ))}
      </div>

      <table className="min-w-full bg-white border mt-6 border-gray-300">
        <thead>
          <tr className="bg-[#A0E9FF]">
            <th className="py-2 px-4 border-b">Event Type</th>
            <th className="py-2 px-4 border-b">Assigned Person</th>
            <th className="py-2 px-4 border-b">Started</th>
            <th className="py-2 px-4 border-b">Finished</th>
            <th className="py-2 px-4 border-b">Payment status</th>
            <th className="py-2 px-4 border-b">Notes</th>
          </tr>
        </thead>
        <tbody>
          {eventTypeArray.map((type: any, index: any) => {
            const assignedPersonsForType = assignedPersonsusers.filter((person: any) => {
              const personEventType = String(person.eventType);
              return personEventType === type;
            });

            const assignedPersonOptions = assignedPersonsForType.map((person: any) => ({
              value: person.userName,
              label: person.userName,
            }));

            return (
              <tr className="hover:bg-[#A0E9FF]" key={index}>
                <td className="py-2 px-4 border-b text-center">{type}</td>
                <td className="py-2 px-4 border-b text-center">
                  {assignedPersonsForType.length > 1 ? (
                    <select
                      value={checkedItems[index]?.assignedPerson || ''}
                      onChange={(e) => handleAssignedPersonChange(e, index, assignedPersonsForType)}
                      className="py-1 px-2 border rounded"
                    >
                      <option value="">Select</option>
                      {assignedPersonOptions.map((option: any) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    assignedPersonsForType[0] ? (
                      assignedPersonsForType[0].userName
                    ) : (
                      <span>No Assigned Person</span>
                    )
                  )}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <input
                    type="checkbox"
                    checked={checkedItems[index]?.started || false}
                    onChange={() => handleCheckboxChange(index, 'started')}
                  />
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <input
                    type="checkbox"
                    checked={checkedItems[index]?.finished || false}
                    onChange={() => handleCheckboxChange(index, 'finished')}
                  />
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <select
                    value={paymentStatusArray[index] || ''}
                    onChange={(e) => handlePaymentStatusChange(e, index)}
                    className="py-1 px-2 border rounded"
                  >
                    <option value="">Select</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <input
                    type="text"
                    value={notesArray[index] || ''}
                    onChange={(e) => handleNotesChange(e, index)}
                    placeholder="Write something..."
                    className="py-1 px-2 border rounded"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <Link href='/eventable'>
     
      <button
          type="button"
          className="bg-cyan-700  transition ease-in-out delay-150 text-white duration-500 px-4 mb-4 mt-6 rounded-md hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 "
        >
          Back
        </button> 
      </Link>
      <button
  type="button"
  className=" mt-6 transition ease-in-out delay-150 bg-cyan-700 text-white duration-500 px-4  float-right rounded-md hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500"
  onClick={handleSave}
>
  Save
</button>
    </div>
  );
};

export default Fulldetails;
