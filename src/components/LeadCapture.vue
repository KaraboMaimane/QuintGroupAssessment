<template>
  <div class="bg-color-gray-02 w-100 py-4">
    <div class="lead-capture-form">
      <h1 class="heading-title">Get in touch with our team today</h1>
      <p class="sub-heading-text">We would love to work with you.</p>

      <form @submit.prevent="submitForm" class="form">
        <div class="grid-parent">
          <div class="form-group">
            <label for="firstName">First Name</label>
            <input type="text" class="form-control " id="firstName" v-model="lead.firstName"
                   :class="{'border-danger': !isValidFirstName && isTouched('firstName')}" required
                   @blur="setTouched('firstName')"/>
            <p v-if="!isValidFirstName && isTouched('firstName')" class="text-danger">Please enter your first name.</p>
          </div>

          <div class="form-group">
            <label for="lastName">Last Name</label>
            <input type="text" class="form-control"
                   :class="{'border-danger': !isValidLastName && isTouched('lastName')}" id="lastName"
                   v-model="lead.lastName" required
                   @blur="setTouched('lastName')"/>
            <p v-if="!isValidLastName && isTouched('lastName')" class="text-danger">Please enter your last name.</p>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" class="form-control" id="email" v-model="lead.email" required
                   :class="{'border-danger': !isValidEmail && isTouched('email')}" @blur="setTouched('email')"/>
            <p v-if="!isValidEmail && isTouched('email')" class="text-danger">Please enter a valid email address.
            </p>
          </div>

          <div class="form-group">
            <label for="phoneNumber">Phone Number</label>
            <input maxlength="10" minlength="10" type="tel" class="form-control" id="phoneNumber"
                   v-model="lead.phoneNumber"
                   :class="{'border-danger': !isValidNumber && isTouched('phoneNumber')}" required
                   @blur="setTouched('phoneNumber')"/>
            <p v-if="!isValidNumber && isTouched('phoneNumber')" class="text-danger">Please enter a valid phone
              number.
            </p>
          </div>
        </div>

        <div class="form-group">
          <label for="address">Address</label>
          <input type="text" class="form-control" id="address" v-model="lead.address"
                 :class="{'border-danger': !isValidAddress && isTouched('address')}" required
                 @blur="setTouched('address')"/>
          <p v-if="!isValidAddress && isTouched('address')" class="text-danger">Please enter your address.</p>
        </div>

        <div class="form-group">
          <label for="country">Country</label>
          <select class="form-control" id="country" v-model="lead.country"
                  :class="{'border-danger': !isValidCountry && isTouched('country')}" required
                  @blur="setTouched('country')">
            <option disabled value="">Select your country</option>
            <option v-for="country in countries" :key="country.alpha2Code" :value="country.name.official">
              {{ country.name.official }}
            </option>
          </select>
          <p v-if="!isValidCountry && isTouched('country')" class="text-danger">Please select a country.</p>
        </div>

        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="yes" id="flexCheckDefault" v-model="lead.marketingOpt"
                 @blur="setTouched('question')"/>
          <label class="form-check-label fw-bold" for="flexCheckDefault">
            Do You Want To Recieve Marketing Emails?
          </label>
        </div>

        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="yes" id="flexCheckDefault" v-model="lead.termsAgreed"
                 :class="{'border-danger': !isValidTerms && isTouched('termsAgreed')}" required
                 @blur="setTouched('termsAgreed')"/>
          <label class="form-check-label fw-bold" for="flexCheckDefault">
            I agree to the <a href="#">Terms and Conditions</a>
          </label>
          <p v-if="!isValidTerms && isTouched('termsAgreed')" class="text-danger">Please agree to our terms.</p>
        </div>

        <button type="submit" class="btn btn-primary mt-2" :disabled="submitPending">Submit</button>
      </form>
    </div>
  </div>

</template>

<script lang="ts">

import {collection, addDoc} from "firebase/firestore"
import db from '../firebase/init';

export default {
  data() {
    return {
      countries: [],
      lead: {
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        country: '',
        phoneNumber: '',
        marketingOpt: false,
        termsAgreed: false,
      },
      submitPending: false,
      isSubmitPending: false,
      touchedFields: {
        firstName: false,
        lastName: false,
        email: false,
        address: false,
        country: false,
        phoneNumber: false,
        termsAgreed: false,
        marketingOpt: false
      },
    }
  },

  computed: {
    isValidFirstName() {
      return this.lead.firstName.trim().length > 0;
    },
    isValidLastName() {
      return this.lead.lastName.trim().length > 0;
    },
    isValidEmail() {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.lead.email);
    },
    isValidAddress() {
      return this.lead.address.trim().length > 0;
    },
    isValidCountry() {
      return this.lead.country.trim().length > 0;
    },
    isValidNumber() {
      return /^\d{10}$/.test(this.lead.phoneNumber);
    },
    isValidTerms() {
      return this.lead.termsAgreed;
    },
  },

  async mounted() {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/all`);
      this.countries = await response.json();
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  },

  methods: {
    setTouched(fieldName) {
      this.touchedFields[fieldName] = true;
    },
    isTouched(fieldName) {
      return this.touchedFields[fieldName];
    },
    isFormValid() {
      return (
          this.isValidFirstName &&
          this.isValidLastName &&
          this.isValidEmail &&
          this.isValidAddress &&
          this.isValidCountry &&
          this.isValidNumber &&
          this.isValidTerms
      );
    },
    resetForm() {
      this.lead = {
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        country: '',
        phoneNumber: '',
        marketingOpt: false,
        termsAgreed: false
      };

      // Reset touched state
      for (const field in this.touchedFields) {
        this.touchedFields[field] = false;
      }
    },
    async submitForm() {
      this.submitPending = true;

      // Check if the form is valid before submitting
      if (this.isFormValid()) {
        try {
          const colRef = collection(db, 'leads');
          const docRef = await addDoc(colRef, this.lead);
          alert('Lead successfully submitted!');
          this.submitPending = false;
          this.resetForm();
        } catch (error) {
          alert('Error submitting the form:');
          this.submitPending = false;
        }
      } else {

        // Mark all fields as touched to display validation errors
        for (const field in this.touchedFields) {
          this.touchedFields[field] = true;
        }
      }
    },
  }
}
</script>

<style>
.bg-color-gray-02 {
  background-color: #fafafa !important;
}

.sub-heading-text {
  font-size: 1.125em;
  font-weight: 700;
  margin-top: 0.25em;
}

.lead-capture-form {
  margin: 0 auto;
  /*padding: 20px;*/
  width: 40%;
}

/*.form-title {*/
/*  font-size: 24px;*/
/*  margin-bottom: 20px;*/
/*}*/

.form-group {
  margin-bottom: 20px;
}

.form-group label,
.form-group p {
  display: block;
  font-size: 16px;
  color: #00a997;
  font-weight: 700;
}

.form-control {
  width: 100%;
  border: 1px solid #00a997 !important;
  padding: 12px;
  font-size: 16px;
  color: #333;
  border-radius: 0 !important;
}

.form-control:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.3);
}

.form-check {
  margin-bottom: 15px;
}

.form-check-label {
  font-size: 16px;
  color: #555;
  margin-left: 5px;
}

.btn-primary {
  background-color: #007bff;
  border: none;
  color: #fff;
  padding: 12px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.grid-parent {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(auto-fit, 1fr);
  grid-column-gap: 2rem;
  /*grid-row-gap: 2rem;*/
}

/* Responsive styles for smaller screens */
@media (max-width: 768px) {
  .lead-capture-form {
    padding: 10px;
    width: 75%;
  }

  .form-title {
    font-size: 20px;
  }

  .form-group label {
    font-size: 14px;
  }

  .form-control {
    padding: 10px;
    font-size: 14px;
  }

  .btn-primary {
    padding: 10px 15px;
    font-size: 14px;
  }
}
</style>

