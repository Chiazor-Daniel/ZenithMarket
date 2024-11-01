import Swal from 'sweetalert2';

export const handleEditLead = async ({formData, editLead, adminToken, id, adminInfo, refetch}) => {
    Swal.fire({
        title: `Confirm edit lead`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, edit it!',
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const res = await editLead({
                    token: adminToken,
                    lead_id: id,
                    admin_id: adminInfo.id,
                    ...formData
                })
                if (res.data.status === "success") {
                    refetch()
                    Swal.fire({
                        title: "Lead updated successfully",
                        icon: "success",
                        confirmButtonColor: '#3085d6',
                    })
                } else {
                    Swal.fire({
                        title: "Error",
                        text: "An error occurred while updating the lead. Please try again later.",
                        icon: "error",
                        confirmButtonColor: '#3085d6',
                    })
                }
            } catch (error) {
                console.error("Error editing lead:", error);
                Swal.fire({
                    title: "Error",
                    text: "An error occurred while updating the lead. Please try again later.",
                    icon: "error",
                    confirmButtonColor: '#3085d6',
                })
            }
        }
    })
}

