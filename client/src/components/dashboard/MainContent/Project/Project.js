import React, { Component } from "react";
import { connect } from "react-redux";
import { getProject } from "../../../../actions/projectsActions";
import { getTasks } from "../../../../actions/taskActions";

import Spinner from "../../../common/Spinner";
import Modal from "../Modal/Modal";

import "../MainContent.css";
import "./Project.css";

class Project extends Component {
  state = {
    modal: false,
    edit: false,
    editTask: false,
    task: false,
    name: "",
    members: [],
    id: "",
    owner: {},
    tasks: [],
    date: ""
  };

  toggleModal = e => {
    this.setState({ modal: !this.state.modal, edit: false, task: false });
  };

  toggleEditModal = (name, members, id, owner, e) => {
    this.setState({
      modal: !this.state.modal,
      edit: !this.state.edit,
      name: name,
      members: members,
      id: id,
      owner: owner
    });
  };

  toggleTaskModal = e => {
    this.setState({
      modal: !this.state.modal,
      task: !this.state.task
    });
  };

  toggleEditTaskModal = e => {
    this.setState({
      modal: !this.state.modal,
      editTask: !this.state.editTask
    });
  };

  componentDidMount() {
    this.props.getProject(this.props.match.params.project);
    this.props.getTasks(this.props.match.params.project);
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.project !== prevProps.match.params.project) {
      this.props.getProject(this.props.match.params.project);
      this.props.getTasks(this.props.match.params.project);
    }
  }

  onChange = async e => {
    await this.setState({ tasks: this.props.tasks.tasks });

    let tasks = await [...this.state.tasks];

    await alert(tasks[e.target.id].taskName);

    tasks[e.target.id].taskName = await e.target.value;

    await this.setState({ tasks });
  };

  render() {
    const { tasks } = this.props.tasks;

    let tasksList = tasks.map((task, index) => (
      <div className="task-input" key={index}>
        <i className="material-icons" onClick={() => alert("TODO")}>
          check_circle
        </i>
        <input
          type="text"
          name="task"
          id={index}
          value={task.taskName}
          onChange={this.onChange}
          className="project-task"
        />
        <span className={!task.assignee ? "task-info muted" : "task-info"}>
          {task.assignee === this.props.auth.user.email
            ? "You"
            : task.assignee || "Unassigned"}
        </span>
        <span
          className={
            task.dateDue === "Date undefined" ? "task-info muted" : "task-info"
          }
        >
          {task.dateDue === "Date undefined" ? "Not Set" : task.dateDue}
        </span>
      </div>
    ));

    if (
      this.props.project &&
      this.props.project.teamMembers &&
      !this.props.projects.projectLoading &&
      !this.props.tasks.tasksLoading
    ) {
      const { project } = this.props;

      return (
        <div className="main-content">
          <h1 className="project-header">{project.name}</h1>
          <button
            onClick={this.toggleEditModal.bind(
              this,
              project.name,
              project.teamMembers,
              project._id,
              project.owner
            )}
            className="main-btn center-btn"
          >
            Edit Project Info
          </button>

          <div className="modal-wrapper">
            <Modal
              onClose={this.toggleModal}
              modal={this.state.modal}
              edit={this.state.edit}
              task={this.state.task}
              name={this.state.name}
              members={this.state.members}
              id={this.state.id}
              owner={this.state.owner}
            />
          </div>
          <div className="tasks-container">
            <div className="projects-first-row">
              <button
                className="main-btn add-btn"
                onClick={this.toggleTaskModal}
              >
                Add task
              </button>
              <div className="projects-column-headers">
                <p>Assignee</p>
                <p>Due</p>
              </div>
            </div>
            <div className="project-tasks">{tasksList}</div>
          </div>
        </div>
      );
    }

    return (
      <div className="project-spinner">
        <Spinner />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  project: state.projects.project,
  projects: state.projects,
  tasks: state.tasks
});

export default connect(
  mapStateToProps,
  { getProject, getTasks }
)(Project);
