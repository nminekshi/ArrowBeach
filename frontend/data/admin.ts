import {
  BarChart3,
  BedDouble,
  Bell,
  CalendarCheck2,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileImage,
  Gauge,
  Gift,
  Home,
  MessageCircle,
  MessageSquare,
  NotebookText,
  PiggyBank,
  ShieldCheck,
  Star,
  UserRound,
  Users,
  Wallet,
  Settings2,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';

export const adminMenu = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Room Management', icon: BedDouble },
  { label: 'Booking Management', icon: CalendarCheck2 },
  { label: 'Customer Management', icon: Users },
  { label: 'Gallery Management', icon: FileImage },
  { label: 'Special Offers', icon: Gift },
  { label: 'Reviews', icon: Star },
  { label: 'Messages', icon: MessageSquare },
  { label: 'Reports & Analytics', icon: BarChart3 },
  { label: 'Settings', icon: Settings2 },
  { label: 'Logout', icon: LogOut },
];

export const overviewMetrics = [
  { label: 'Total Rooms', value: '48', icon: Home, change: '+2 this month' },
  { label: 'Available Rooms', value: '14', icon: CheckCircle2, change: 'Live inventory' },
  { label: 'Occupied Rooms', value: '34', icon: BedDouble, change: '71% occupancy' },
  { label: 'Total Bookings', value: '1,284', icon: NotebookText, change: '+86 this month' },
  { label: "Today's Check-ins", value: '9', icon: CalendarCheck2, change: 'Due by 2 PM' },
  { label: "Today's Check-outs", value: '7', icon: Clock3, change: 'Scheduled until noon' },
  { label: 'Monthly Revenue', value: 'Rs 4.8M', icon: Wallet, change: '+18.4% vs last month' },
  { label: 'Occupancy Rate', value: '82%', icon: Gauge, change: 'Healthy demand' },
];

export const recentBookings = [
  { guest: 'Nimali Perera', room: 'Ocean View Room', dates: '27 Jun - 29 Jun', status: 'Confirmed', amount: 'Rs 21,000' },
  { guest: 'Arjun Patel', room: 'Family Room', dates: '28 Jun - 01 Jul', status: 'Pending', amount: 'Rs 45,000' },
  { guest: 'Michelle Tan', room: 'Deluxe Room', dates: '30 Jun - 02 Jul', status: 'Checked-in', amount: 'Rs 24,000' },
  { guest: 'Kevin Silva', room: 'Family Room', dates: '01 Jul - 03 Jul', status: 'Cancelled', amount: 'Rs 30,000' },
];

export const recentCustomers = [
  { name: 'Nimali Perera', email: 'nimali@example.com', phone: '+94 77 111 2233', stays: '4 stays' },
  { name: 'Arjun Patel', email: 'arjun@example.com', phone: '+91 98 1122 3344', stays: '2 stays' },
  { name: 'Michelle Tan', email: 'michelle@example.com', phone: '+65 8123 4567', stays: '1 stay' },
  { name: 'Sanjeewa Fernando', email: 'sanjeewa@example.com', phone: '+94 77 222 9988', stays: '6 stays' },
];

export const roomManagementHighlights = [
  'Add Room',
  'Edit Room',
  'Delete Room',
  'Upload Multiple Images',
  'Manage Room Availability',
  'Set Room Price',
  'Manage Amenities',
];

export const bookingManagementHighlights = [
  'View All Bookings',
  'Approve Booking',
  'Reject Booking',
  'Assign Room',
  'Check-in Guest',
  'Check-out Guest',
  'Booking Status Filter',
  'Search Bookings',
];

export const customerManagementHighlights = [
  'View Customers',
  'Search Customers',
  'View Booking History',
  'Edit Customer Details',
  'Block/Delete Customer',
];

export const galleryManagementHighlights = [
  'Upload Images',
  'Delete Images',
  'Organize Categories',
];

export const specialOffersHighlights = [
  'Create Offers',
  'Edit Offers',
  'Delete Offers',
  'Set Expiry Date',
];

export const reviewHighlights = [
  'View Reviews',
  'Approve Reviews',
  'Delete Reviews',
  'Reply to Reviews',
];

export const messageHighlights = [
  'View Contact Messages',
  'Reply to Customers',
  'Mark Messages as Read',
];

export const reportHighlights = [
  'Booking Report',
  'Revenue Report',
  'Occupancy Report',
  'Customer Report',
  'Export PDF/Excel',
];

export const settingsHighlights = [
  'Hotel Information',
  'Contact Details',
  'Social Media Links',
  'Logo Upload',
  'Hotel Policies',
  'Change Admin Password',
];

export const revenueSeries = [
  { label: 'Jan', value: 54 },
  { label: 'Feb', value: 62 },
  { label: 'Mar', value: 58 },
  { label: 'Apr', value: 71 },
  { label: 'May', value: 74 },
  { label: 'Jun', value: 88 },
];

export const bookingTrendSeries = [
  { label: 'Week 1', value: 22 },
  { label: 'Week 2', value: 34 },
  { label: 'Week 3', value: 29 },
  { label: 'Week 4', value: 41 },
];

export const chartStats = [
  { label: 'Conversion rate', value: '17.8%', icon: CircleDollarSign },
  { label: 'Average stay', value: '2.7 nights', icon: BedDouble },
  { label: 'Repeat guests', value: '38%', icon: UserRound },
  { label: 'Message response', value: '8 min', icon: MessageCircle },
];

export const adminSummaryCards = [
  { label: 'Revenue collected', value: 'Rs 4.8M', icon: PiggyBank },
  { label: 'Pending actions', value: '23', icon: Bell },
  { label: 'New reviews', value: '18', icon: Star },
  { label: 'Open support messages', value: '12', icon: MessageCircle },
  { label: 'Room blocks', value: '4', icon: ShieldCheck },
  { label: 'Offers active', value: '6', icon: Gift },
];

export const topNavItems = ['Overview', 'Operations', 'Revenue', 'Reports', 'Settings'];
