import React, { useEffect, useState } from "react";
import profile from "../../../assets/p2.png";
import {
  getDatabase,
  ref,
  onValue,
  push,
  set,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";


const People = () => {
  const [userList, setUserList] = useState([]);
  const [friendRequest, setFriendRequest] = useState([]);
  const [friends, setFriends] = useState([]);
  const [block, setBlock] = useState([]);
  const db = getDatabase();
  const notify = () => toast();
  const userTotalInfo = useSelector((state) => state.userData.userInfo);

  useEffect(() => {
    const userRef = ref(db, "users/");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        if (userTotalInfo.uid !== item.key) {
          arr.push({ ...item.val(), reqId: item.key });
        }
      });
      setUserList(arr);
    });
  }, []);

  useEffect(() => {
    const userRef = ref(db, "friendRequest");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().receverId + item.val().senderId);
      });
      setFriendRequest(arr);
    });
  }, []);


  useEffect(() => {
    const userRef = ref(db, "friends");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        arr.push(item.val().receverId + item.val().senderId);
      });
      setFriends(arr);
    });
  }, []);

  useEffect(() => {
    const userRef = ref(db, "block");
    onValue(userRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        console.log(item.val());
        arr.push(item.val().blockRecevidId + item.val().blockSenderId
        );
      });
      setBlock(arr);
    });
  }, []);

  const handleFriendRequest = (friendRequest) => {
    set(push(ref(db, "friendRequest")), {
      senderName: userTotalInfo.displayName,
      senderId: userTotalInfo.uid,
      receverName: friendRequest.displayName,
      receverId: friendRequest.reqId,
    }).then(()=>{
      toast("Friend Request Successfully!");
    })
  };

  const handleCancel = (requestCancel) => {
    console.log(requestCancel);
    remove(ref(db, 'friendRequest/')).then(()=>{
      toast("Friend Request Cancel Successfully!");
    })
    
  };

  return (
    <div className="w-full h-96 bg-gray-700 shadow-lg rounded-lg mt-4 overflow-auto">
      <div className="flex justify-between px-4 pt-4">
        <h3 className="text-lg font-bold">People</h3>
      </div>
      <div className="px-7">
        <form>
          <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Members..."
            />

            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* People start */}
      {userList.map((user) => (
        <>
          <div className="flex justify-between px-5 mt-5 border-b pb-2">
            <div className="flex items-center space-x-4">
              <img src={profile} alt="profile" />

              <div className="font-medium dark:text-white">
                <div>{user.displayName}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </div>
              </div>
            </div>
            <div>
              {friendRequest.includes(user.reqId + userTotalInfo.uid) 
              ? 
                
                  <button
                  onClick={() => handleCancel(user.reqId)}
                    type="button"
                    className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Cancel
                  </button>
                  : friendRequest.includes( userTotalInfo.uid + user.reqId)
                  ?
                  <button
                    type="button"
                    className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    pending
                  </button>
                  :
                  friends.includes(user.reqId + userTotalInfo.uid) || friends.includes( userTotalInfo.uid + user.reqId)
                  ?
                  <button
                    type="button"
                    className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Friends
                  </button>
                  :
                  block.includes(user.reqId + userTotalInfo.uid) || block.includes( userTotalInfo.uid + user.reqId)
                  ?
                  <button
                    type="button"
                    className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Block
                  </button>
                  :
                  
              
                <button
                  onClick={() => handleFriendRequest(user)}
                  type="button"
                  className="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                >
                  Add
                </button>
              }
            </div>
          </div>
        </>
      ))}

      {/* People end */}
    </div>
  );
};

export default People;
