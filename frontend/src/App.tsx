import { useState } from "react";
import ChatBox from "./components/ChatBox.tsx";
import ToggleChatBtn from "./components/ToggleChatBtn.tsx";
import EmployeeSidebar from "./components/EmployeeSidebar.tsx";
import { useEmployees, type Employee } from "./hooks/useEmployees.ts";
import EmployeeDetail from "./components/EmployeeDetail.tsx";

const App = () => {
  const { employees, fetchEmployees, isLoading } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isShown, setIsShown] = useState(true);

  return (
    <div className="flex bg-gray-100">
      <div className="w-66 bg-white border-r border-gray-200 shadow-sm">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <EmployeeSidebar
            employees={employees}
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
          />
        )}
      </div>

      <div className="flex-1 p-6">
        {selectedEmployee ? (
          <EmployeeDetail employee={selectedEmployee} />
        ) : (
          <div className="flex  justify-center h-full text-gray-500">
            <p>Select an employee to view details</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-4 right-4 z-50">
        {isShown ? (
          <ChatBox setIsShown={setIsShown} fetchEmployees={fetchEmployees} />
        ) : (
          <ToggleChatBtn setIsShown={setIsShown} />
        )}
      </div>
    </div>
  );
};
export default App;
