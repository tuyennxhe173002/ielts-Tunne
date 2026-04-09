export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <main className="shell"><div className="glass p-8">Reset password token: {token}</div></main>;
}
