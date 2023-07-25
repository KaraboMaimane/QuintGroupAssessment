<template>
  <div class="row">
    <div class="lead-capture-form">
      <h2 style="font-size: 24px; margin-bottom: 20px;">Lead Capture Form</h2>
      <form @submit.prevent="submitForm" style=" margin: 0 auto;">
        <div class="form-group">
          <label for="firstName">First Name</label>
          <input type="text" class="form-control " id="firstName" v-model="lead.firstName" :class="{'border-danger': !isValidFirstName && isTouched('firstName')}" required
                 @blur="setTouched('firstName')"/>
          <label v-if="!isValidFirstName && isTouched('firstName')" class="text-danger">Please enter your first name.</label>
        </div>

        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input type="text" class="form-control" :class="{'border-danger': !isValidLastName && isTouched('lastName')}" id="lastName" v-model="lead.lastName" required
                 @blur="setTouched('lastName')"/>
          <label v-if="!isValidLastName && isTouched('lastName')" class="text-danger">Please enter your last name.</label>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" class="form-control" id="email" v-model="lead.email" required :class="{'border-danger': !isValidEmail && isTouched('email')}" @blur="setTouched('email')"/>
          <div v-if="!isValidEmail && isTouched('email')" class="text-danger">Please enter a valid email address.
          </div>
        </div>

        <div class="form-group">
          <label for="address">Address</label>
          <input type="text" class="form-control" id="address" v-model="lead.address" :class="{'border-danger': !isValidAddress && isTouched('address')}" required
                 @blur="setTouched('address')"/>
          <div v-if="!isValidAddress && isTouched('address')" class="text-danger">Please enter your address.</div>
        </div>

        <div class="form-group">
          <label for="country">Country</label>
          <select class="form-control" id="country" v-model="lead.country" :class="{'border-danger': !isValidCountry && isTouched('country')}" required @blur="setTouched('country')">
            <option disabled value="">Select your country</option>
            <option v-for="country in countries" :key="country.alpha2Code" :value="country.name.official">
              {{ country.name.official }}
            </option>
          </select>
          <div v-if="!isValidCountry && isTouched('country')" class="text-danger">Please select a country.</div>
        </div>

        <div class="form-group">
          <label for="phoneNumber">Phone Number</label>
          <input maxlength="10" minlength="10" type="tel" class="form-control" id="phoneNumber" v-model="lead.phoneNumber"
                 :class="{'border-danger': !isValidNumber && isTouched('phoneNumber')}" required @blur="setTouched('phoneNumber')"/>
          <div v-if="!isValidNumber && isTouched('phoneNumber')" class="text-danger">Please enter your phone
            number.
          </div>
        </div>

        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="yes" id="flexCheckDefault" v-model="lead.marketingOpt"
                 @blur="setTouched('question')"/>
          <label class="form-check-label" for="flexCheckDefault">
            Do You Want To Recieve Marketing Emails?
          </label>
        </div>

        <div class="form-check">
          <input class="form-check-input" type="checkbox" value="yes" id="flexCheckDefault" v-model="lead.termsAgreed"
                 :class="{'border-danger': !isValidTerms && isTouched('termsAgreed')}" required @blur="setTouched('termsAgreed')"/>
          <label class="form-check-label" for="flexCheckDefault">
            I agree to the <a href="#">Terms and Conditions</a>
          </label>
          <div v-if="!isValidTerms && isTouched('termsAgreed')" class="text-danger">Please agree to our terms.</div>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="submitPending" style="margin-top: 20px;">Submit</button>
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

.lead-capture-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 16px;
  color: #555;
}

.form-control {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 12px;
  font-size: 16px;
  color: #333;
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

/* Responsive styles for smaller screens */
@media (max-width: 768px) {
  .lead-capture-form {
    padding: 10px;
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

