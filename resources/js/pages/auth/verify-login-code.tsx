import { useForm, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyLoginCode() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/verify-login-code');
    };

    return (
        <AuthLayout
            title="Verify Login Code"
            description="A 6-digit code has been sent to your email. Please enter it below to continue."
        >
            <Head title="Verify Logic Code" />

            <form onSubmit={submit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="code">6-Digit Code</Label>
                        <Input
                            id="code"
                            type="text"
                            name="code"
                            value={data.code}
                            onChange={(e) => setData('code', e.target.value)}
                            required
                            autoFocus
                            tabIndex={1}
                            maxLength={6}
                            placeholder="123456"
                            className="text-center text-xl tracking-widest"
                        />
                        <InputError message={errors.code} />
                    </div>

                    <Button
                        type="submit"
                        className="mt-4 w-full"
                        tabIndex={2}
                        disabled={processing}
                    >
                        {processing && <Spinner />}
                        Verify Code
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}
