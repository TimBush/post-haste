function deletePost() {
  const postId = document.querySelector(".yes").getAttribute("id");
  axios
    .delete(`/post/delete/${postId}`)
    .then(response => {
      window.location = response.data;
    })
    .catch(err => {
      console.log(err);
      window.location = "/";
    });
}

function showFile() {
  if (document.getElementById("viewFileUpload").checked === true) {
    document.getElementById("video").removeAttribute("disabled");
  } else {
    document.getElementById("video").setAttribute("disabled", "true");
  }
}
