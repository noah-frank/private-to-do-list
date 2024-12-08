<template>
  <div
    id="register-box"
    class="modal"
    aria-labelledby="register-modal-title"
    role="dialog"
  >
    <div class="modal-content">
      <span
        class="close"
        role="button"
        tabindex="0"
        aria-label="Close"
        @click="closeModal"
        >&times;</span
      >
      <h2 id="register-modal-title">Create new account</h2>
      <form id="register-form" @submit.prevent="registerUser">
        <button
          type="button"
          id="toggle-guidelines-btn"
          :aria-expanded="guidelinesVisible"
          aria-controls="registration-guidelines"
          @click="toggleGuidelines"
        >
          {{
            guidelinesVisible
              ? "Hide Registration Guidelines"
              : "Show Registration Guidelines"
          }}
        </button>

        <RegistrationGuidelines :visible="guidelinesVisible" />

        <label for="register-username">Username</label>
        <input
          type="text"
          id="register-username"
          v-model="username"
          @input="validateUsername"
        />
        <div id="username-feedback" :style="{ color: feedbackColor }">
          {{ usernameFeedback }}
        </div>

        <label for="register-password">Password</label>
        <input
          type="password"
          id="register-password"
          v-model="password"
          @input="validatePassword"
        />
        <div id="password-feedback" :style="{ color: passwordFeedbackColor }">
          {{ passwordFeedback }}
        </div>

        <button type="submit" id="sign-up-btn" :disabled="!formValid">
          Sign Up
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import RegistrationGuidelines from "@/components/RegistrationGuidelines.vue";

export default {
  components: {
    RegistrationGuidelines,
  },
  data() {
    return {
      guidelinesVisible: false,
      username: "",
      password: "",
      usernameFeedback: "",
      feedbackColor: "black",
      passwordFeedback: "",
      passwordFeedbackColor: "black",
    };
  },
  computed: {
    formValid() {
      return (
        this.username.length >= 3 &&
        this.password.length >= 8 &&
        this.passwordFeedback === ""
      );
    },
  },
  methods: {
    async validateUsername() {
      if (this.username.length < 3) {
        this.usernameFeedback = "Username must be at least 3 characters";
        this.feedbackColor = "red";
        return;
      }

      try {
        const response = await fetch(
          `/api/auth/check-username?username=${encodeURIComponent(this.username)}`,
        );
        const data = await response.json();
        if (data.isAvailable) {
          this.usernameFeedback = "Username is available";
          this.feedbackColor = "green";
        } else {
          this.usernameFeedback = "Username is already taken";
          this.feedbackColor = "red";
        }
      } catch (error) {
        console.error("Error:", error);
        this.usernameFeedback = "Error checking username";
        this.feedbackColor = "red";
      }
    },
    validatePassword() {
      const password = this.password;

      if (password.length < 8) {
        this.passwordFeedback = "Password must be at least 8 characters long";
        this.passwordFeedbackColor = "red";
        return;
      }
      if (!/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
        this.passwordFeedback =
          "Password must include both upper and lower case letters";
        this.passwordFeedbackColor = "red";
        return;
      }
      if (!/\d/.test(password)) {
        this.passwordFeedback = "Password must include at least one number";
        this.passwordFeedbackColor = "red";
        return;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        this.passwordFeedback =
          "Password must include at least one special symbol like !, @, #, etc.";
        this.passwordFeedbackColor = "red";
        return;
      }

      this.passwordFeedback = "";
      this.passwordFeedbackColor = "green";
    },
    async registerUser() {
      try {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to register user");
        }

        const data = await response.json();
        console.debug("Success:", data);
        this.$router.push("/tasks");
      } catch (error) {
        console.error("Error:", error);
        alert("Registration failed. Please try again.");
      }
    },
    toggleGuidelines() {
      this.guidelinesVisible = !this.guidelinesVisible;
    },
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss">
#register-form {
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 5px;
  }

  input[type="text"],
  input[type="password"] {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 3px;
  }
}

.modal {
  position: fixed;
  z-index: 2;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);

  &-content {
    background-color: #fefefe;
    margin: 10% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 80%;
    max-width: 500px;
    border-radius: 5px;
    box-shadow:
      0 4px 8px 0 rgba(0, 0, 0, 0.2),
      0 6px 20px 0 rgba(0, 0, 0, 0.19);

    h2 {
      margin-bottom: 20px;
      color: #333;
      font-size: 24px;
    }
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;

    &:hover,
    &:focus {
      color: black;
      text-decoration: none;
      cursor: pointer;
    }
  }
}

#sign-up-btn {
  @extend %button-style;
  background-color: #323aa8;

  &:hover {
    background-color: #292c89;
  }

  &:active {
    background-color: #1e1f5e;
  }
}

#toggle-guidelines-btn {
  color: white;
  padding: 10px 15px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s;

  background-color: #323aa8;

  &:hover {
    background-color: #292c89;
  }

  &:active {
    background-color: #1e1f5e;
  }
}
</style>
