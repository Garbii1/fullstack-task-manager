import React from 'react';
        import AuthForm from '../components/Auth/AuthForm';

        function RegisterPage() {
          return (
            <div>
              <h2>Register</h2>
              <AuthForm /> {/* Defaults to register */}
            </div>
          );
        }

        export default RegisterPage;