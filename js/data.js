// Sample data for FixDali prototype
const IMG = (n) => `assets/images/${n}`;

const SAMPLE_IMAGES = [
  "898243919_1144357628051847_6388726759784974267_n.jpg",
  "898243919_4493841000903465_4594618448253981268_n.jpg",
  "899053385_2137317957173952_2617789889343872339_n.jpg",
  "899127869_1150034737748372_6581773839887025553_n.jpg",
  "899818042_2137048940259708_5123763752151035091_n.jpg",
  "900598403_1660812525687878_6814546492302812790_n.jpg",
  "902171438_2171190690436659_853088382425926450_n.jpg",
  "902368130_1525083382780082_3312790790228685460_n.jpg",
];

const CATEGORIES = [
  { id:"plumbing", name:"Plumbing", ico:"🚰", color:"#DBEAFE" },
  { id:"electrical", name:"Electrical", ico:"⚡", color:"#FEF3C7" },
  { id:"carpentry", name:"Carpentry", ico:"🔨", color:"#FCE7F3" },
  { id:"painting", name:"Painting", ico:"🎨", color:"#E0E7FF" },
  { id:"ac", name:"AC Repair", ico:"❄️", color:"#D1FAE5" },
  { id:"cleaning", name:"Cleaning", ico:"🧹", color:"#F3E8FF" },
  { id:"appliance", name:"Appliance", ico:"🔧", color:"#FEE2E2" },
  { id:"pest", name:"Pest Control", ico:"🐜", color:"#E5E7EB" },
];

const TECHNICIANS = [
  { id:1, name:"Juan Dela Cruz", cat:"plumbing", rating:4.9, reviews:128, price:450, exp:"8 yrs", hours:"8:00 AM – 5:00 PM", avatar:IMG(SAMPLE_IMAGES[0]), bio:"Licensed plumber specializing in leak repair, pipe installation and water heater servicing.", available:true, verified:true, jobs:340 },
  { id:2, name:"Maria Santos", cat:"electrical", rating:4.8, reviews:96, price:500, exp:"6 yrs", hours:"9:00 AM – 6:00 PM", avatar:IMG(SAMPLE_IMAGES[1]), bio:"Certified electrician. Residential wiring, panel upgrades and lighting installation.", available:true, verified:true, jobs:210 },
  { id:3, name:"Pedro Reyes", cat:"carpentry", rating:4.7, reviews:74, price:400, exp:"10 yrs", hours:"8:00 AM – 3:00 PM", avatar:IMG(SAMPLE_IMAGES[2]), bio:"Custom furniture, cabinet making and general woodwork.", available:false, verified:true, jobs:185 },
  { id:4, name:"Ana Lim", cat:"painting", rating:4.9, reviews:112, price:350, exp:"5 yrs", hours:"10:00 AM – 7:00 PM", avatar:IMG(SAMPLE_IMAGES[3]), bio:"Interior/exterior painting, wallpaper and texture finishing.", available:true, verified:true, jobs:260 },
  { id:5, name:"Carlos Tan", cat:"ac", rating:4.6, reviews:63, price:600, exp:"7 yrs", hours:"7:00 AM – 4:00 PM", avatar:IMG(SAMPLE_IMAGES[4]), bio:"AC cleaning, installation and repair for split and window units.", available:true, verified:false, jobs:140 },
  { id:6, name:"Liza Gomez", cat:"cleaning", rating:4.8, reviews:88, price:300, exp:"4 yrs", hours:"6:00 AM – 2:00 PM", avatar:IMG(SAMPLE_IMAGES[5]), bio:"Deep cleaning, move-in/out cleaning and sanitation services.", available:true, verified:true, jobs:320 },
  { id:7, name:"Mark Villanueva", cat:"appliance", rating:4.5, reviews:51, price:450, exp:"9 yrs", hours:"11:00 AM – 8:00 PM", avatar:IMG(SAMPLE_IMAGES[6]), bio:"Washing machine, refrigerator and oven repair.", available:true, verified:true, jobs:175 },
  { id:8, name:"Rosa Mendoza", cat:"pest", rating:4.7, reviews:44, price:550, exp:"6 yrs", hours:"8:00 AM – 5:00 PM", avatar:IMG(SAMPLE_IMAGES[7]), bio:"Termite treatment, general pest control and fumigation.", available:false, verified:true, jobs:98 },
];

const REVIEWS = [
  { user:"Andrea P.", rating:5, text:"Very professional and on time. Fixed the leak in 30 minutes!", date:"2 days ago" },
  { user:"Liam S.", rating:4, text:"Good work, slightly pricey but worth it.", date:"1 week ago" },
  { user:"Maria R.", rating:5, text:"Highly recommended. Clean and tidy after work.", date:"2 weeks ago" },
];

const BOOKINGS = [
  { id:"BK-1001", tech:1, service:"Leak repair", date:"Nov 20, 2026", time:"10:00 AM", status:"confirmed", address:"123 Rizal St., Dali", price:450, img:SAMPLE_IMAGES[0] },
  { id:"BK-1002", tech:2, service:"Outlet installation", date:"Nov 18, 2026", time:"2:00 PM", status:"completed", address:"45 Mabini Ave., Dali", price:500, img:SAMPLE_IMAGES[1] },
  { id:"BK-1003", tech:4, service:"Interior painting (1 room)", date:"Nov 22, 2026", time:"9:00 AM", status:"pending", address:"78 Bonifacio Rd., Dali", price:3500, img:SAMPLE_IMAGES[3] },
  { id:"BK-1004", tech:6, service:"Deep cleaning", date:"Nov 10, 2026", time:"8:00 AM", status:"cancelled", address:"123 Rizal St., Dali", price:300, img:SAMPLE_IMAGES[5] },
];

const MESSAGES = [
  { id:1, tech:1, last:"I'll be there at 10 AM sharp.", time:"9:45 AM", unread:1 },
  { id:2, tech:2, last:"Job completed. Please rate.", time:"Yesterday", unread:0 },
  { id:3, tech:4, last:"Can you send photos of the room?", time:"2 days ago", unread:2 },
];

const CHAT_THREAD = [
  { from:"them", text:"Hi! I'm Juan, your plumber. I got your booking for leak repair.", time:"9:30 AM" },
  { from:"me", text:"Great, thanks! The leak is under the kitchen sink.", time:"9:32 AM" },
  { from:"them", text:"Got it. I'll bring the right tools. Any parking nearby?", time:"9:35 AM" },
  { from:"me", text:"Yes, visitor parking at the gate.", time:"9:36 AM" },
  { from:"them", text:"I'll be there at 10 AM sharp.", time:"9:45 AM" },
];

const NOTIFICATIONS = [
  { ico:"✅", title:"Booking confirmed", body:"BK-1001 confirmed with Juan Dela Cruz.", time:"10 min ago" },
  { ico:"💬", title:"New message", body:"Juan sent you a message.", time:"15 min ago" },
  { ico:"⭐", title:"Rate your service", body:"How was your experience with Maria Santos?", time:"1 day ago" },
  { ico:"🎉", title:"Promo", body:"20% off first AC cleaning. Use code COOL20.", time:"2 days ago" },
];

const ADDRESSES = [
  { id:1, label:"Home", value:"123 Rizal St., Barangay Dali" },
  { id:2, label:"Office", value:"45 Mabini Ave., Dali Town Center" },
];

const PAYMENTS = [
  { id:1, type:"GCash", value:"0917****1234", primary:true },
  { id:2, type:"Card", value:"**** **** **** 4242", primary:false },
  { id:3, type:"Cash", value:"Pay technician after service", primary:false },
];

const USER = { name:"Ashley Reyes", email:"ashley@fixdali.test", phone:"09171234567", avatar:IMG(SAMPLE_IMAGES[2]) };

const ADMIN_STATS = [
  { val:"1,284", lbl:"Total Bookings" },
  { val:"86", lbl:"Active Technicians" },
  { val:"₱482K", lbl:"Revenue (MTD)" },
  { val:"4.8", lbl:"Avg Rating" },
];

const ADMIN_BOOKINGS = [
  { id:"BK-1001", customer:"Ashley R.", tech:"Juan D.", status:"confirmed", price:450 },
  { id:"BK-1002", customer:"Mark T.", tech:"Maria S.", status:"completed", price:500 },
  { id:"BK-1003", customer:"Liza G.", tech:"Ana L.", status:"pending", price:3500 },
  { id:"BK-1005", customer:"Carlo M.", tech:"Carlos T.", status:"in-progress", price:600 },
];

const ADMIN_AI = { freeScansUsed:"238", subscribers:"100", mrr:"₱4,900", price:"₱49/month" };
