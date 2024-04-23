<dialog id="updateModal" className="modal">
  <div className="modal-box">
    <h3 className="font-bold text-lg">Edit</h3>
    <form className="w-full max-w-lg">
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            First Name
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
            type="text"
            placeholder="John"
            value={userData.firstname}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Last Name
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            placeholder="Doe"
            value={userData.lastname}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Email
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            placeholder="john@doe.com"
            value={userData.email}
          />
        </div>
        <div className="w-full md:w-1/2 px-3">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Role
          </label>
          <div className="relative">
            <select
              className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              value={userData.role}
            >
              <option>Student</option>
              <option>Professor</option>
              <option>Admin</option>
            </select>
          </div>
        </div>
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0 mt-4">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Speciality
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            type="text"
            placeholder="Developer"
            value={userData.speciality}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3 relative">
          <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
            Password
          </label>
          <input
            className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500 pr-10 pl-10"
            type={passwordVisible ? "text" : "password"}
            value={userData.password}
          />
          <button type="button" onClick={togglePasswordVisibility}>
            {passwordVisible ? (
              <FAIcons.FaEyeSlash
                size={17}
                className="opacity-60 absolute left-6 top-10"
              />
            ) : (
              <FAIcons.FaEye
                size={17}
                className="opacity-60 absolute left-6 top-10"
              />
            )}
          </button>
          <button type="button" onClick={handleRegeneratePassword}>
            <MDIcons.MdLoop
              size={20}
              className="opacity-60 absolute right-6 top-9"
            />
          </button>
        </div>
      </div>
    </form>
    <div className="modal-action">
      <button className="btn mr-2 border-orange-600 text-orange-600">
        Edit
      </button>
      <button
        className="btn"
        onClick={() => document.getElementById("updateModal").close()}
      >
        Cancel
      </button>
    </div>
  </div>
</dialog>;
