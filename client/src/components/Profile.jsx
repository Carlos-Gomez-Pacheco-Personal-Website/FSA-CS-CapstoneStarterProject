import PropTypes from "prop-types";

const Profile = ({ user }) => {
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Profile</h2>
      <p>Username: {user.username}</p>
      {/* Render other user details as needed */}
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.object,
};

export default Profile;
