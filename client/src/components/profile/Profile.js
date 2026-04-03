import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Spinner from "../layout/Spinner.js";
import { getProfileById } from "../../actions/profile.js";
import ProfileTop from "./ProfileTop.js";
import ProfileAbout from "./ProfileAbout.js";
import ProfileExperience from "./ProfileExperience.js";
import ProfileEducation from "./ProfileEducation.js";
import ProfileGithub from "./ProfileGithub.js";

const Profile = ({
  auth,
  profile: { profile, loading },
  getProfileById,
  match,
}) => {
  const { id } = useParams();
  useEffect(() => {
    getProfileById(id);
  }, [getProfileById, id]);
  return (
    <>
      {!loading && profile ? (
        <>
          <Link to="/profiles" className="btn btn-light">
            Back To Profiles
          </Link>
          {!auth.loading &&
            auth.isAuthenticated &&
            auth.user._id === profile.user._id && (
              <>
                <Link to="/edit-profile" className="btn btn-dark">
                  Edit Profile
                </Link>
              </>
            )}{" "}
          <div class="profile-grid my-1">
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className="profile-exp bg-white p-2">
              <h2 class="text-primary">Experience</h2>
              {profile.experience.length > 0 ? (
                <>
                  {profile.experience.map((experience) => (
                    <ProfileExperience
                      key={experience._id}
                      experience={experience}
                    />
                  ))}
                </>
              ) : (
                <h4>No experience recorded</h4>
              )}
            </div>{" "}
            <div className="profile-edu bg-white p-2">
              <h2 class="text-primary">Education</h2>
              {profile.education.length > 0 ? (
                <>
                  {profile.education.map((education) => (
                    <ProfileEducation
                      key={education._id}
                      education={education}
                    />
                  ))}
                </>
              ) : (
                <h4>No education recorded</h4>
              )}
            </div>
            {profile.githubusername && (
              <ProfileGithub username={profile.githubusername} />
            )}
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </>
  );
};

Profile.propTypes = {
  getProfileById: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
});
export default connect(mapStateToProps, { getProfileById })(Profile);
