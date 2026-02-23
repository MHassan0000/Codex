import Link from "next/link";

const PrivacyPolicy = () => {
    return (
        <section className="w-full">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/"
                        className="text-xs uppercase tracking-[2px] text-white/30 hover:text-orange-accent transition-colors duration-300"
                    >
                        ← Back to Home
                    </Link>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-6">
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-white/30 mt-2">
                        Last updated: February 23, 2026
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-10">
                    <div>
                        <h2 className="text-lg font-semibold text-white/90 mb-3">
                            1. Information We Collect
                        </h2>
                        <p className="text-sm text-white/45 leading-relaxed">
                            When you create an account on Codex, we collect your
                            full name, email address, university ID number, and
                            a photo of your university card for verification
                            purposes. We also collect information about your
                            borrowing activity, including books borrowed, return
                            dates, and reading preferences.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white/90 mb-3">
                            2. How We Use Your Information
                        </h2>
                        <p className="text-sm text-white/45 leading-relaxed mb-3">
                            We use the information we collect to:
                        </p>
                        <ul className="space-y-2 text-sm text-white/45 leading-relaxed ml-4">
                            <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2.25 before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-accent/40">
                                Verify your identity and university affiliation
                            </li>
                            <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2.25 before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-accent/40">
                                Process and manage your book borrow requests
                            </li>
                            <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2.25 before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-accent/40">
                                Send notifications about due dates and account
                                status
                            </li>
                            <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2.25 before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-accent/40">
                                Improve our library services and user experience
                            </li>
                            <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2.25 before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-accent/40">
                                Maintain the security and integrity of our
                                platform
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white/90 mb-3">
                            3. Data Storage and Security
                        </h2>
                        <p className="text-sm text-white/45 leading-relaxed">
                            Your data is stored securely using
                            industry-standard encryption and security practices.
                            Passwords are hashed using bcrypt and are never
                            stored in plain text. We use secure, encrypted
                            connections for all data transfers between your
                            browser and our servers. Access to personal data is
                            restricted to authorized administrators only.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white/90 mb-3">
                            4. Third-Party Services
                        </h2>
                        <p className="text-sm text-white/45 leading-relaxed">
                            We use select third-party services to operate Codex,
                            including cloud hosting providers for data storage,
                            email services for account notifications, and image
                            hosting for book covers and university card
                            verification. These providers are bound by their own
                            privacy policies and we only share the minimum data
                            necessary for their services to function.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white/90 mb-3">
                            5. Your Rights
                        </h2>
                        <p className="text-sm text-white/45 leading-relaxed mb-3">
                            You have the right to:
                        </p>
                        <ul className="space-y-2 text-sm text-white/45 leading-relaxed ml-4">
                            <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2.25 before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-accent/40">
                                Access the personal data we hold about you
                            </li>
                            <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2.25 before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-accent/40">
                                Request correction of inaccurate information
                            </li>
                            <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2.25 before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-accent/40">
                                Request deletion of your account and associated
                                data
                            </li>
                            <li className="relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2.25 before:w-1.5 before:h-1.5 before:rounded-full before:bg-orange-accent/40">
                                Opt out of non-essential communications
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white/90 mb-3">
                            6. Cookies and Tracking
                        </h2>
                        <p className="text-sm text-white/45 leading-relaxed">
                            Codex uses essential cookies to maintain your login
                            session and ensure the platform functions correctly.
                            We do not use advertising cookies or third-party
                            tracking scripts. Session data is stored securely
                            and expires automatically after a period of
                            inactivity.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white/90 mb-3">
                            7. Data Retention
                        </h2>
                        <p className="text-sm text-white/45 leading-relaxed">
                            We retain your personal data for as long as your
                            account is active. Borrowing history is retained for
                            administrative and record-keeping purposes. If you
                            request account deletion, your personal information
                            will be removed within 30 days, though anonymized
                            borrowing statistics may be retained for library
                            analytics.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white/90 mb-3">
                            8. Changes to This Policy
                        </h2>
                        <p className="text-sm text-white/45 leading-relaxed">
                            We may update this Privacy Policy from time to time.
                            Any changes will be posted on this page with an
                            updated revision date. Continued use of Codex after
                            changes are posted constitutes acceptance of the
                            revised policy.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-lg font-semibold text-white/90 mb-3">
                            9. Contact
                        </h2>
                        <p className="text-sm text-white/45 leading-relaxed">
                            If you have questions about this Privacy Policy or
                            how your data is handled, please contact the library
                            administration through your university&apos;s
                            official channels.
                        </p>
                    </div>
                </div>

                {/* Bottom divider */}
                <div className="mt-16 pt-8 border-t border-white/6">
                    <p className="text-xs text-white/20">
                        &copy; {new Date().getFullYear()} Codex. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default PrivacyPolicy;
