document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.delete_button').forEach(function(button) {
        button.addEventListener('click', function() {
            const apptid = this.getAttribute('data-apptid');
            if (confirm('Are you sure you want to delete this appointment?')) {
                fetch('/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ apptid: apptid })
                })
                .then(response => {
                    if (response.ok) {
                        window.location.reload(); // Reload the page after successful deletion
                    } else {
                        console.error('Failed to delete appointment');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        });
    });
});
