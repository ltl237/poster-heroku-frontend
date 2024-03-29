import React, { Fragment, Component } from 'react';
import Faker from 'faker'
import TimeAgo from 'timeago-react';
import NewCommentForm from './NewCommentForm'
import LikeButton from './LikeButton'

let allUsers = []
let theUser = {}
class PostModal extends Component {

  state = {
    postToView: this.props.post,
    commentsOnPost: this.props.post.comments,
    allUsers: []
  }

  renderLikes = () => {

    switch (this.props.post.likes) {
      case 0:
        return <p className="likes">{this.props.likes} Likes</p>
      case 1:
        return <p className="likes">{this.props.likes} Like</p>
      default:
        return <p className="likes">{this.props.likes} Likes</p>
    }
  }

  handleAddComment = (commentObj) => {

    this.setState({
      commentsOnPost: [...this.state.commentsOnPost, commentObj]
    })
  }

  componentDidMount() {
    fetch('https://threes-nutz-backend.herokuapp.com/api/v1/users')
    .then(res => res.json())
    .then(data => {
      this.setState({
        allUsers: data
      })
    })
  }

  findUser = (userID) => {
    return this.state.allUsers.find(user => {
      return user.id === userID
    })
  }

  handleUserClick = (event, userWhoCommented) => {
    event.preventDefault()
    const userObj = this.props.post.user
    // const userObj = theUser
    this.props.changeProfileToView(userObj)
    document.querySelector("body").classList.toggle("modal-open")
  }

  renderSingleComment = (comment) => {

    theUser = this.findUser(comment.user_id)

    if (theUser) {
      return <li key={comment.id}>{comment.content} - <a onClick={this.handleUserClick} href="">{theUser.username}</a></li>
    } else {
      return <li key={comment.id}>{comment.content}></li>
    }

  }

  render() {
    return (
      <div id="viewing-modal" className={"modal fade bd-example-modal-lg-" + this.props.post.id} tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            {
              this.props.post.user ?
              <Fragment>
                <section className="post-header">
                  <div className="avatar-username">
                    <img style={{position: "bottom"}} src={Faker.image.avatar()} width="auto" height="auto" alt="..."/>
                  </div>
                  <div className="title">
                    <strong><p style={{fontSize:"150%", marginLeft:"10%", marginTop:"2%", float:"right", width:"100%"}}>{this.props.post.title}</p></strong>
                    <h4 className="media-heading" style={{float:"left", marginLeft:"2%", marginTop:"5%"}}>Author: {this.props.post.user ? <a onClick={this.handleUserClick} href=""> {this.props.post.user.username} </a> : null}
                    <br/><p className="post-user" style={{fontSize:'10px', float:"left", marginLeft: "5%"}}>Created: <TimeAgo datetime={this.props.post.created_at}/></p></h4>
                  </div>
                </section>
                <hr></hr>
                <section className="post-footer">
                  <div>
                    <p className="post-content">{this.props.post.content}</p>
                  </div>
                  <hr></hr>
                  <div className="post-footer-option container" style={{"display":"flex", "width":"auto", "justifyContent":"space-between"}}>
                    <div className="category-likes">

                    </div>
                    <div className="comment-like-wrapper">
                      <NewCommentForm currentUser={this.props.currentUser} handleAddComment={this.handleAddComment} post={this.props.post} user={this.props.post.user} addNewComment={this.props.addNewComment}/>
                      <LikeButton addLike={this.props.addLike} post={this.props.post} user={this.props.post.user}/>
                      {this.renderLikes()}
                    </div>
                  </div>
                  <hr></hr>


                  <div className="comments-div">
                    <ul>
                    {
                      this.state.commentsOnPost.map(comment => this.renderSingleComment(comment))
                    }
                    </ul>
                  </div>
                </section>
              </Fragment>
              :
              null
            }
          </div>
        </div>
      </div>
    );
  }

}

export default PostModal;
//                       <button type="button" className="btn btn-light"><i className="glyphicon glyphicon-thumbs-up"></i>({this.props.post.likes.length}) Like</button>
// <div>
//   <LikeButton post={this.props.post} user={this.props.post.user}/>
//   <button  data-toggle="modal" data-target={".bd-example-modal-lg-" + this.props.post.id} type="button" className="btn btn-light"><i className="glyphicon glyphicon-comment"></i> Comments</button>
// </div>
