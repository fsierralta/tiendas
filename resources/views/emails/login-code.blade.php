<x-mail::message>
# Login Verification Code

You are trying to log in to your account. Please use the following 6-digit code to complete the login process.

**<p style="text-align: center; font-size: 24px; letter-spacing: 5px;">{{ $code }}</p>**

This code will expire in 3 minutes.

If you did not request this, please ignore this email.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
