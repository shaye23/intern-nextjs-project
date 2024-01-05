// components/EventForm.js
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
//import{v4 as uuid4}
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';

const EventForm = () => {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const initialValues = {
    eventName: '',
    date: '',
    time: '',
    venue: '',
    contact: '',
    eventType: [],
    approxamount:''
  };
  async function addDataToFirestore(userInput: any) {
    try {
      
      const eventId = uuidv4();

      const dataWithId = { ...userInput, id: eventId };

      const docRef = await addDoc(collection(db, 'eventuser'), dataWithId);
  
      console.log('Document written with id:', docRef.id);
      return true;
    } catch (error) {
      console.error('Error adding document', error);
      return false;
    }
  }
 
  const eventType:any=['Decoration', 'Catering','Transportation','Entertainment','SpecialGuest','PartyHall','MarriageHall'];
  const validationSchema = Yup.object().shape({
    eventName: Yup.string().required('Event Name is required'),
    date: Yup.date().required('Date is required'),
    time: Yup.string().required('Time is required'),
    venue: Yup.string().required('Venue is required'),
    contact: Yup.string()
    .required('Contact is required')
    .matches(/^\d{10}$/, 'Contact must be exactly 10 digits'),
   // eventType: Yup.array().min(1, 'Select at least one event type'),
    approxamount: Yup.string().required('Amount is required'),

    eventType: Yup.array()
    .min(1, 'Select at least one event type')
    .test({
      name: 'approxAmountCheck',
      message: 'Sum of approximate amounts should be equal to the total amount',
      test: function (eventTypes: string[] | undefined) {
        if (!eventTypes) {
          return false;
        }

        const totalApproxAmount = eventTypes.reduce((total, eventType) => {
          const eventTypeBudget = this.parent[`budget_${eventType}`] || '0';
          return total + parseFloat(eventTypeBudget);
        }, 0);

        return parseFloat(this.parent.approxamount) === totalApproxAmount;
      },
    }),
  });
  
 
  const formik:any = useFormik({
    initialValues,
    onSubmit: async (values) => {
      try {
        const added = await addDataToFirestore(values);

        if (added) {
          formik.resetForm();
          toast.success('Data Stored in db!');
          router.push('/dashboard');
          
        }
      } catch (err) {
        console.error(err);
        toast.success('Error occured!');
        setErrorMessage('Error during registration');
      }
    },
    validationSchema, // Move validationSchema here
  });
  return (
    <div className="flex items-center bg-registerbg bg-cover bg-center justify-center min-w-full mt-0 .py-20">
    <div className="w-1/2 max-w-md p-4 rounded bg-white  bg-opacity-60 backdrop-filter backdrop-blur-lg shadow-[rgba(0,_0,_0,_0.4)_0px_30px_90px] my-8">
        <div>
          <h1 className="text-2xl font-boldfont-sans text-primary text-center mb-4 ">New Event</h1>
          <form onSubmit={formik.handleSubmit}>
            {/* Event Name Field */}
            <div className="form-control">
              <label className="block mb-1 font-semibold ">Name of Event:</label>
              <input
                type="text"
                name="eventName"
                className={`w-full p-2 border rounded mb-1 ${formik.touched.eventName && formik.errors.eventName ? 'border-red-500' : ''}`}
                placeholder="Event Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.eventName}
              />
              {formik.touched.eventName && formik.errors.eventName && (
                <div className="error text-red-500">{formik.errors.eventName}</div>
              )}
            </div>
            {/* Date Field */}
            <div className="form-control">
              <label className="block mb-1 font-bold">Date:</label>
              <input
                type="date"
                name="date"
                className={`w-full p-2 border rounded mb-1 ${formik.touched.date && formik.errors.date ? 'border-red-500' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.date}
              />
              {formik.touched.date && formik.errors.date && (
                <div className="error text-red-500">{formik.errors.date}</div>
              )}
            </div>
            {/* Time Field */}
            <div className="form-control">
              <label className="block mb-1 font-bold">Time:</label>
              <input
                type="time"
                name="time"
                className={`w-full p-2 border rounded mb-1 ${formik.touched.time && formik.errors.time ? 'border-red-500' : ''}`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.time}
              />
              {formik.touched.time && formik.errors.time && (
                <div className="error text-red-500">{formik.errors.time}</div>
              )}
            </div>
            {/* Venue Field */}
            <div className="form-control">
  <label className="block mb-1 font-bold">Venue:</label>
  <textarea
    name="venue"
    className={`w-full p-2 border rounded mb-1 ${formik.touched.venue && formik.errors.venue ? 'border-red-500' : ''}`}
    placeholder="Event Venue"
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    value={formik.values.venue}
  />
  {formik.touched.venue && formik.errors.venue && (
    <div className="error text-red-500">{formik.errors.venue}</div>
  )}
</div>

            {/* Contact Field */}
            <div className="form-control">
              <label className="block mb-1 font-bold">Contact:</label>
              <input
                type="tel"
                name="contact"
                className={`w-full p-2 border rounded mb-1 ${formik.touched.contact && formik.errors.contact ? 'border-red-500' : ''}`}
                placeholder="Contact"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.contact}
              />
              {formik.touched.contact && formik.errors.contact && (
                <div className="error text-red-500">{formik.errors.contact}</div>
              )}
            </div>
            <div className="form-control">
              <label className="block mb-1 font-semibold">Approx Amount:</label>
              <input
                type="text"
                name="approxamount"
                className={`w-full p-2 border rounded mb-1 ${
                  formik.touched.userName && formik.errors.userName ? 'border-red-500' : ''
                }`}
                placeholder="Appprox Amount "
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.approxamount}
              />
              {formik.touched.approxamount && formik.errors.approxamount && (
                <div className="error text-red-500">{formik.errors.approxamount}</div>
              )}
            </div>
            
            {/* Event Planners Checkboxes */}
                {/* Event Types Checkboxes */}
                 {/* Event Types Checkboxes */}
                 <div className="form-control">
  <label className="block mb-1 font-semibold">Event Types:</label>
  {eventType.map((type: any) => (
    <div key={type} className="flex items-center mb-1">
      <input
        type="checkbox"
        id={type}
        name="eventType"
        value={type}
        checked={formik.values.eventType.includes(type)}
        onChange={() => {
          const newEventTypes = formik.values.eventType.includes(type)
            ? formik.values.eventType.filter((eventType: string) => eventType !== type)
            : [...formik.values.eventType, type];

          formik.setFieldValue('eventType', newEventTypes);
        }}
      />
      <label htmlFor={type} className="ml-2">{type}</label>

      {/* Input area for budget */}
      {formik.values.eventType.includes(type) && (
        <input
          type="number"
          name={`budget_${type}`}
          className="ml-4 p-1"
          placeholder="Budget"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[`budget_${type}`]}
        />
      )}
    </div>
  ))}
  {formik.touched.eventType && formik.errors.eventType && (
    <div className="error text-red-500">{formik.errors.eventType}</div>
  )}
  
</div>
        {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md"
            >
              Create Event
            </button>
            <Link href="/eventable">
            <button
              type="submit"
              className="w-full p-2 border border-white mt-6 bg-[#D3D3D3]  rounded-md"
            >
              Cancel
            </button>
            </Link>
            {/* Error Message */}
            {errorMessage && (
              <div className="error text-red-500 mt-2">{errorMessage}</div>
            )}
          </form>
         
        </div>
      </div>
    </div>
  );
};

export default EventForm;
