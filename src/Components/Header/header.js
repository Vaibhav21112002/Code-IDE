import React from "react";

function Header() {
  return (
    <div>
      {/* Header Starts */}
      <header className="text-gray-600 body-font">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
          <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
            <img
              className="headerImage"
              src="https://res.cloudinary.com/dumgn8uvd/image/upload/v1623168872/acciojob_tcnetd.png"
            />
            <span className="ml-3 text-xl">AccioJob</span>
          </a>
        </div>
      </header>
      {/* Header Ends */}
    </div>
  );
}


export default Header;