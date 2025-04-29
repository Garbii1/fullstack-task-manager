import React from 'react';
        import AuthForm from '../components/Auth/AuthForm';

        function LoginPage() {
          return (
            <div>
              <h2>Login</h2>
              <AuthForm isLogin />
            </div>
          );
        }

        export default LoginPage;