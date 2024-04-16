import PropTypes from "prop-types";
import profilePicture from "../assets/l60Hf.png";

const Profile = ({ user }) => {
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <img src={profilePicture} alt="Profile" width={150} />
      <p>Username: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      {/* Render other user details as needed */}
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.object,
};

export default Profile;
