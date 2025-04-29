const trash = document.getElementsByClassName("fa-trash-o");
const cog = document.getElementsByClassName("fa-cog");
const editForm = document.getElementsByClassName("editForm");

Array.from(cog).forEach(function(element) {
    element.addEventListener('click', function(){
        const id = this.dataset.id
      const form = document.querySelector(`.editForm[data-id="${id}"]`)
      form.style.display = form.style.display === 'none' ? 'block' : 'none'
    })
})

Array.from(editForm).forEach(function(element) {
    element.addEventListener('submit', async function(e){// e is the event object
        e.preventDefault() //Stop the browser from doing the default thing it normally does when a form submits so we can use fetch
      
      const id = this.dataset.id
      const formData = new FormData(this) // (this) is the form the user just submitted

      const data = {
        name: formData.get('name'),
        company: formData.get('company'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        notes: formData.get('notes'),
      }
      // formData is grabing everything from the form that was just submitted. saves me a bumch of time and key stokes.

      try {
        const res = await fetch(`/clients/${id}/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })

        if (res.ok) {
          window.location.reload() // Refresh to show updated data
        } else {
          alert('Failed to update client')
        }
      } catch (err) {
        console.error(err)
        alert('Something went wrong')
      }
    })
  })

  Array.from(trash).forEach(function(element) {
    element.addEventListener('click', async function(){
        const id = this.dataset.id

      if (confirm('Are you sure you want to delete this client?')) { //setting this as an alert cause idk how to make it something else right now and im running out of time.
        try {
          const res = await fetch(`/clients/${id}/delete`, {
            method: 'POST',
          })

          if (res.ok) {
            window.location.reload()
          } else {
            alert('Failed to delete client')
          }
        } catch (err) {
          console.error(err)
          alert('Something went wrong')
        }
      }
    })
  })

