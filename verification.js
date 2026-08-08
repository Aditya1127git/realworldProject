const searchBtn = document.querySelector("#searchBtn");
const registration = document.querySelector("#registration");
const result = document.querySelector("#result");

async function searchStudent() {

    const registrationNumber = registration.value.trim();
    const response = await fetch(
    `/student/${registrationNumber}`
);
    
    if (!response.ok) {
        result.innerHTML = `
        <div class="alert alert-danger mt-4">
            Student Not Found
        </div>
    `;
        return;
    }

    const data = await response.json();

    result.innerHTML = `
        <div class="card shadow mx-auto mt-5" style="max-width:720px;">
            <div class="card-body p-5">
                <h3 class="mb-4">Student Details</h3>
                <hr>

                <div class="row mb-3">
                    <div class="col-5 fw-semibold">Roll Number</div>
                    <div class="col-7">${data.rollNumber || ""}</div>
                </div>

                <div class="row mb-3">
                    <div class="col-5 fw-semibold">Student Name</div>
                    <div class="col-7">${data.name || ""}</div>
                </div>

                <div class="row mb-3">
                    <div class="col-5 fw-semibold">Course</div>
                    <div class="col-7">${data.course || ""}</div>
                </div>

                <div class="row mb-3">
                    <div class="col-5 fw-semibold">Qualification</div>
                    <div class="col-7">${data.qualification || ""}</div>
                </div>

                <div class="row mb-3">
                    <div class="col-5 fw-semibold">Status</div>
                    <div class="col-7 text-success fw-bold">${data.status || ""}</div>
                </div>

                <div class="row mb-3">
                    <div class="col-5 fw-semibold">Enrollment Number</div>
                    <div class="col-7">${data.enrollmentNumber || ""}</div>
                </div>

                <div class="row mb-3">
                    <div class="col-5 fw-semibold">Validation Period</div>
                    <div class="col-7">${data.validationPeriod || ""}</div>
                </div>
            </div>
        </div>
    `;
}

searchBtn.addEventListener("click", searchStudent);

registration.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchStudent();
    }
});