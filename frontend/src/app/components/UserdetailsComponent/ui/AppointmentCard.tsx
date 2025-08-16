import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon, PhoneIcon, FilterIcon } from 'lucide-react';
interface Appointment {
  id: string;
  type: string;
  doctor: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
  notes?: string;
  status: 'upcoming' | 'completed';
}

export const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4 shadow-sm">
      <div className=" flex flex-col md:flex-row items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3  global-bg-color rounded-full"></div>
            <h3 className="text-lg font-medium text-gray-900">{appointment.type}</h3>
            <span className={`px-3 py-1 ${appointment.status === "upcoming"? "bg-orange-500": "bg-green-600"}  text-white text-sm rounded-full capitalize`}>
              {appointment.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <UserIcon className="w-4 h-4" />
              <div>
                <div className="font-medium text-gray-900">{appointment.doctor}</div>
                <div className="text-sm">{appointment.specialty}</div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <CalendarIcon className="w-4 h-4" />
              <span>{appointment.date}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <ClockIcon className="w-4 h-4" />
              <span>{appointment.time}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <MapPinIcon className="w-4 h-4" />
              <span>{appointment.location}</span>
            </div>
          </div>

          {appointment.notes && (
            <div className="flex items-start gap-2 text-gray-600 mb-4">
              <div className="w-4 h-4 mt-0.5 bg-blue-100 rounded flex items-center justify-center">
                <div className="w-2 h-2  global-bg-color rounded"></div>
              </div>
              <p className="text-sm">{appointment.notes}</p>
            </div>
          )}
        </div>

        <div className="flex flex-row md:flex-col  gap-2 ml-4">
          <button className="flex items-center gap-2  global-bg-color text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            <PhoneIcon className="w-4 h-4" />
            Help
          </button>
          <button className="px-4 py-2 border border-teal-600 global-text-color-teal rounded-lg hover:bg-blue-50 transition-colors">
            Reschedule
          </button>
        </div>
      </div>
    </div>
  );