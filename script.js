
const SUPABASE_URL = "https://tgpzrvnumfofwuxisine.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_LRf7AjNo46JUa0bEJ6dGQg_hhVNxIMP";

const db = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const form = document.getElementById("studentForm");
const statusText = document.getElementById("status");
const submitButton = document.getElementById("submit-btn");

async function imageToDataURL(file) {
  if (!file) return null;

  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image file.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be smaller than 5 MB.");
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(
      new Error("Could not read image.")
    );

    reader.readAsDataURL(file);
  });
}

form.addEventListener("submit", async function(event) {
  event.preventDefault();

  submitButton.disabled = true;
  statusText.textContent = "Please wait... Sending registration.";
  statusText.style.color = "#123d70";

  try {
    const studentPhotoFile =
      document.getElementById("student-photo").files[0];

    const parentPhotoFile =
      document.getElementById("parent-photo").files[0];

    const studentPhoto =
      await imageToDataURL(studentPhotoFile);

    const parentPhoto =
      await imageToDataURL(parentPhotoFile);

    const studentData = {
      student_name:
        document.getElementById("student-name").value.trim(),

      student_age:
        Number(document.getElementById("age").value),

      student_photo: studentPhoto,

      parent_photo: parentPhoto,

      nid_number:
        document.getElementById("nid").value.trim(),

      student_status:
        document.getElementById("education-status").value,

      previous_grade:
        document.getElementById("previous-grade").value.trim() || null,

      average_score:
        document.getElementById("average").value === ""
          ? null
          : Number(document.getElementById("average").value),

      section:
        document.getElementById("section").value,

      student_signature:
        document.getElementById("student-signature").value.trim() || null,

      parent_signature:
        document.getElementById("parent-signature").value.trim() || null,

      registration_date:
        new Date().toISOString().slice(0, 10)
    };

    const { error } = await db
      .from("students")
      .insert([studentData]);

    if (error) {
      throw error;
    }

    statusText.textContent =
      "Registration successful! Student data sent to the school.";

    statusText.style.color = "green";
    form.reset();

  } catch (error) {
    console.error("Supabase registration error:", error);

    statusText.textContent =
      "Registration failed: " +
      (error.message || "Unknown error");

    statusText.style.color = "red";

  } finally {
    submitButton.disabled = false;
  }
});
