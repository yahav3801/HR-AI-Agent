import type { Employee } from "../hooks/useEmployees";

const EmployeeDetail = ({ employee }: { employee: Employee }) => {
  const formatSalary = (salary: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(salary);
  };

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600 bg-green-100";
    if (rating >= 4.0) return "text-blue-600 bg-blue-100";
    if (rating >= 3.5) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {employee.first_name.charAt(0)}
            {employee.last_name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">
              {employee.first_name} {employee.last_name}
            </h1>
            <p className="text-xl text-gray-600 mt-1">
              {employee.job_details.job_title}
            </p>
            <p className="text-lg text-gray-500">
              {employee.job_details.department}
            </p>
            <div className="flex items-center gap-4 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {employee.job_details.employment_type}
              </span>
              <span className="text-sm text-gray-500">
                ID: {employee.employee_id}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {formatSalary(
                employee.job_details.salary,
                employee.job_details.currency
              )}
            </p>
            <p className="text-sm text-gray-500">Annual Salary</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Date of Birth
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(employee.date_of_birth)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {employee.contact_details.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Phone
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {employee.contact_details.phone_number}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Address
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {employee.address.street}
                  <br />
                  {employee.address.city}, {employee.address.state}{" "}
                  {employee.address.postal_code}
                  <br />
                  {employee.address.country}
                </p>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Employment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Hire Date
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(employee.job_details.hire_date)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Reporting Manager
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {employee.reporting_manager || "N/A"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Work Location
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {employee.work_location.nearest_office}
                  {employee.work_location.is_remote && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Remote
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {employee.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Performance Reviews */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Performance Reviews
            </h2>
            <div className="space-y-4">
              {employee.performance_reviews.map((review, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(review.review_date)}
                    </span>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRatingColor(
                        review.rating
                      )}`}
                    >
                      {review.rating}/5
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{review.comments}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          {employee.notes && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Notes
              </h2>
              <p className="text-sm text-gray-600">{employee.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Benefits */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Benefits
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Health Insurance
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {employee.benefits.health_insurance}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Retirement Plan
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {employee.benefits.retirement_plan}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Paid Time Off
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {employee.benefits.paid_time_off} days
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Emergency Contact
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {employee.emergency_contact.name}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Relationship
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {employee.emergency_contact.relationship}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Phone
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {employee.emergency_contact.phone_number}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Stats
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Years at Company
                </span>
                <span className="text-sm text-gray-900">
                  {Math.floor(
                    (new Date().getTime() -
                      new Date(employee.job_details.hire_date).getTime()) /
                      (365.25 * 24 * 60 * 60 * 1000)
                  )}{" "}
                  years
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Skills Count
                </span>
                <span className="text-sm text-gray-900">
                  {employee.skills.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Performance Reviews
                </span>
                <span className="text-sm text-gray-900">
                  {employee.performance_reviews.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-500">
                  Average Rating
                </span>
                <span className="text-sm text-gray-900">
                  {(
                    employee.performance_reviews.reduce(
                      (sum, review) => sum + review.rating,
                      0
                    ) / employee.performance_reviews.length
                  ).toFixed(1)}
                  /5
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;
