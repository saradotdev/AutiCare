from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext_lazy as _

class UserManager(BaseUserManager):
    """Custom user manager with required fields validation"""

    def create_user(self, email, password, first_name, **extra_fields):
        # Validate required fields
        if not email:
            raise ValueError(_('Email is required'))
        if not password:
            raise ValueError(_('Password is required'))
        if not first_name:
            raise ValueError(_('First name is required'))

        email = self.normalize_email(email)
        user = self.model(
            email=email,
            first_name=first_name,
            **extra_fields
        )
        user.set_password(password)  # Hash password
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, first_name, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, first_name, **extra_fields)

class User(AbstractUser):
    # Remove username field
    username = None

    # Required fields (enforced at DB level)
    email = models.EmailField(
        _('email address'),
        unique=True,
        error_messages={'unique': _("A user with this email already exists.")}
    )
    first_name = models.CharField(
        _('first name'),
        max_length=150,
        blank=False  # Enforce first name requirement
    )

    # Optional fields
    last_name = models.CharField(_('last name'), max_length=150, blank=True)

    # Additional fields
    email_OTP = models.CharField(max_length=6, blank=True, null=True)
    email_verified = models.BooleanField(default=False)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Authentication configuration
    USERNAME_FIELD = 'email'          # Used for login
    REQUIRED_FIELDS = ['first_name']  # Required for createsuperuser command

    objects = UserManager()

    def __str__(self):
        return self.email

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')