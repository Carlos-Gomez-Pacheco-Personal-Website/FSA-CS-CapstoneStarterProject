import PropTypes from "prop-types";
import profilePicture from "../assets/l60Hf.png";
import { Card, ListGroup } from "react-bootstrap";

const Profile = ({ user }) => {
  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{ paddingTop: "32px", display: "flex", justifyContent: "center" }}
    >
      <Card
        style={{
          width: "18rem",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        }}
      >
        <Card.Img variant="top" src={profilePicture} alt="Profile" />
        <Card.Body>
          <Card.Title>{user.username}</Card.Title>
        </Card.Body>
        <ListGroup variant="flush">
          <ListGroup.Item>Email: {user.email}</ListGroup.Item>
          <ListGroup.Item>Phone: {user.phone}</ListGroup.Item>
          {/* Render other user details as needed */}
        </ListGroup>
      </Card>
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.object,
};

export default Profile;
