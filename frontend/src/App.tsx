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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <div className="flex bg-gray-100">
      {!isSidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      )}
      {isSidebarOpen && (
        <div className="w-66 bg-white border-r border-gray-200 shadow-sm">
          <button
            className="fixed top-5 left-50 z-50"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
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
      )}
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
