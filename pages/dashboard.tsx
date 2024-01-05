import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { AgChartsReact } from 'ag-charts-react';
import Sidebar from './sidebar';

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [eventData, setEventData] = useState([]);
  const [eventTypeCounts, setEventTypeCounts] = useState<any>({
    Decoration: 0,
    Catering: 0,
    Transportation: 0,
    SpecialGuests: 0,
    PartyHall: 0,
    MarriageHall: 0,
    Entertainment: 0,
  });
  const [monthlyEventCounts, setMonthlyEventCounts] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();

      // Fetch user data
      const usersCollection = collection(db, 'users');
      try {
        const usersSnapshot = await getDocs(usersCollection);
        setUserCount(usersSnapshot.size);

        const typeCounts: any = {
          Decoration: 0,
          Catering: 0,
          Transportation: 0,
          SpecialGuests: 0,
          PartyHall: 0,
          MarriageHall: 0,
          Entertainment: 0,
        };

        usersSnapshot.forEach((userDoc) => {
          const userData = userDoc.data();
          if (userData.eventType) {
            typeCounts[userData.eventType]++;
          }
        });

        setEventTypeCounts(typeCounts);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }

      // Fetch event data
      const eventsCollection = collection(db, 'eventuser');
      try {
        const eventsSnapshot = await getDocs(eventsCollection);
        const eventsData: any = eventsSnapshot.docs.map((doc) => doc.data());
        setEventCount(eventsSnapshot.size);
        setEventData(eventsData);

        // Count events for each month
        const monthlyCounts: any = {};
        eventsData.forEach((event: any) => {
          const eventDate = new Date(event.date);
          const monthKey = `${eventDate.getFullYear()}-${eventDate.getMonth() + 1}`;

          if (monthlyCounts[monthKey]) {
            monthlyCounts[monthKey]++;
          } else {
            monthlyCounts[monthKey] = 1;
          }
        });

        setMonthlyEventCounts(monthlyCounts);
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchData();
  }, []);

  const userChartOptions: any = {
    width: 500,
    height: 600,
    data: [
      { typeCount: eventTypeCounts.Entertainment, typeName: 'Entertainment' },
      { typeCount: eventTypeCounts.Decoration, typeName: 'Decoration' },
      { typeCount: eventTypeCounts.Catering, typeName: 'Catering' },
      { typeCount: eventTypeCounts.SpecialGuests, typeName: 'SpecialGuests' },
      { typeCount: eventTypeCounts.Transportation, typeName: 'Transportation' },
      { typeCount: eventTypeCounts.PartyHall, typeName: 'Party hall' },
      { typeCount: eventTypeCounts.MarriageHall, typeName: 'MarriageHall' },
    ],
    title: {
      text: 'Users Composition',
    },
    series: [
      {
        type: 'pie',
        angleKey: 'typeCount',
        labelKey: 'typeName',
        calloutLabelKey: 'typeName',
        sectorLabelKey: 'typeCount',
        sectorLabel: {
          color: 'white',
          fontWeight: 'bold',
        },
      },
    ],
  };

  const monthlyEventChartOptions: any = {
    title: {
      text: 'Number of Events by Month',
    },
    data: Object.keys(monthlyEventCounts).map((month) => ({
      month,
      count: monthlyEventCounts[month],
    })),
    series: [
      {
        type: 'bar',
        xKey: 'month',
        yKey: 'count',
      },
    ],
  };

  return (
    
    <div className='flex'>
      <Sidebar/>
    
   
      <div className="flex flex-col items-center justify-center">
        <div className="flex">
          <div className="bg-gray-300 p-10 rounded-md mx-24 mt-6 h-24">
            <p className="text-black text-lg">Number of Users: {userCount}</p>
          </div>
          <div className="bg-gray-300 p-10 rounded-md  mx-16  mt-6 h-24">
            <p className="text-black text-lg">Number of Events: {eventCount}</p>
          </div>
        </div>

        <div className="mt-6 flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-lg font-bold mb-2">Users Composition</h2>
            <AgChartsReact options={userChartOptions} />
          </div>
        </div>

        <div className="mt-6 flex justify-center items-center">
          <div className="text-center">
            <h2 className="text-lg font-bold mb-2">Monthly Event Counts</h2>
            <AgChartsReact options={monthlyEventChartOptions} />
          </div>
        </div>
      </div>
     
    </div>
  );
};

export default Dashboard;
