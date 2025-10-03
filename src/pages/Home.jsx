import React from "react";
import Card from "../components/Card";
function Home() {
  return (
    <div className="mt-10 flex  flex-col space-y-3 items-center md:flex-row md:space-x-20 justify-center">
      <div className="w-50 bg-[#803FA5] rounded-sm">
        <Card>
          <div className="flex flex-col items-center ">
            <h1 className=" text-lg">
              Tasks <button>+</button>
            </h1>
          </div>
        </Card>
      </div>

      <div className="w-50 bg-[#101204] rounded-sm">
        <Card>
          <div className="flex flex-col items-center ">
            <h1 className=" text-lg">In Progress</h1>
          </div>
        </Card>
      </div>
      <div className="w-50 bg-[#533F04] rounded-sm">
        <Card>
          <div className="flex flex-col items-center ">
            <h1 className=" text-lg">Review</h1>
          </div>
        </Card>
      </div>
      <div className="w-50 bg-[#164B35] rounded-sm">
        <Card>
          <div className="flex flex-col items-center ">
            <h1 className=" text-lg">Done</h1>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Home;
