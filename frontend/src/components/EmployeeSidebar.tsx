import type { Employee } from "../hooks/useEmployees";

interface EmployeeSidebarProps {
  employees: Employee[];
  selectedEmployee: Employee | null;
  setSelectedEmployee: (employee: Employee | null) => void;
}
const EmployeeSidebar = ({
  employees,
  selectedEmployee,
  setSelectedEmployee,
}: EmployeeSidebarProps) => {
  return (
    <div className="h-full flex flex-col fixed border-r border-gray-200">
      <div className="p-4  border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Employees</h2>
        <p className="text-sm text-gray-500">{employees.length} total</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {employees.map((employee) => (
          <div
            key={employee.employee_id}
            onClick={() => setSelectedEmployee(employee)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedEmployee?.employee_id === employee.employee_id
                ? "bg-blue-50 border-l-4 border-l-blue-500"
                : ""
            }`}
          >
            <div className="flex items-center gap-3">
              {/* Avatar placeholder */}
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium">
                {employee.first_name.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {employee.first_name} {employee.last_name}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {employee.job_details.job_title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeSidebar;
