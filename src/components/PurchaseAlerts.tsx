
import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "lucide-react";

// Data for generating random alerts
const firstNames = [
  "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", 
  "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
  "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa",
  "Matthew", "Margaret", "Anthony", "Betty", "Mark", "Sandra", "Donald", "Ashley",
  "Steven", "Emily", "Andrew", "Donna", "Paul", "Michelle", "Joshua", "Carol",
  "Kenneth", "Amanda", "Kevin", "Dorothy", "Brian", "Melissa", "George", "Deborah",
  "Timothy", "Stephanie", "Ronald", "Rebecca", "Edward", "Sharon", "Jason", "Laura",
  "Jeffrey", "Cynthia", "Ryan", "Kathleen", "Jacob", "Amy", "Gary", "Angela",
  "Nicholas", "Shirley", "Eric", "Anna", "Jonathan", "Ruth", "Stephen", "Brenda",
  "Larry", "Pamela", "Justin", "Nicole", "Scott", "Katherine", "Brandon", "Virginia",
  "Benjamin", "Catherine", "Samuel", "Christine", "Gregory", "Samantha", "Alexander", "Debra",
  "Patrick", "Janet", "Frank", "Rachel", "Raymond", "Carolyn", "Jack", "Emma",
  "Dennis", "Maria", "Jerry", "Heather", "Tyler", "Diane", "Aaron", "Julie",
  "Jose", "Joyce", "Adam", "Victoria", "Nathan", "Kelly", "Henry", "Christina",
  "Zachary", "Lauren", "Douglas", "Joan", "Peter", "Evelyn", "Kyle", "Olivia",
  "Noah", "Judith", "Walter", "Megan", "Ethan", "Cheryl", "Jeremy", "Martha",
  "Harold", "Andrea", "Keith", "Frances", "Christian", "Hannah", "Roger", "Jacqueline",
  "Terry", "Ann", "Gerald", "Gloria", "Sean", "Jean", "Austin", "Kathryn",
  "Carl", "Alice", "Arthur", "Teresa", "Lawrence", "Sara", "Dylan", "Janice"
];

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
  "Wisconsin", "Wyoming"
];

const giftCardAmounts = [100, 500, 1000, 5000];

const PurchaseAlerts = () => {
  const [alerts, setAlerts] = useState<Array<{
    id: number;
    name: string;
    amount: number;
    state: string;
    visible: boolean;
  }>>([]);
  const [nextId, setNextId] = useState(1);

  const generateRandomAlert = () => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const state = states[Math.floor(Math.random() * states.length)];
    const amount = giftCardAmounts[Math.floor(Math.random() * giftCardAmounts.length)];
    
    const newAlert = {
      id: nextId,
      name: firstName,
      amount,
      state,
      visible: true
    };
    
    setNextId(prev => prev + 1);
    setAlerts(prev => [...prev, newAlert]);
    
    // Remove alert after 10 seconds (changed from 5 seconds)
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
    }, 10000);
  };

  useEffect(() => {
    // Generate initial alert
    generateRandomAlert();
    
    // Set interval for new alerts (every 15 seconds) (changed from 30 seconds)
    const intervalId = setInterval(() => {
      generateRandomAlert();
    }, 15000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2 max-w-xs">
      {alerts.map(alert => (
        <Alert 
          key={alert.id}
          className="bg-gradient-to-r from-green-600/90 to-green-800/90 text-white border-green-500/50 shadow-lg animate-fade-in"
        >
          <Badge className="h-4 w-4 text-white mr-2" />
          <AlertDescription className="text-sm font-medium">
            {alert.name} just purchased a ${alert.amount} gift card from {alert.state}!
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
};

export default PurchaseAlerts;
