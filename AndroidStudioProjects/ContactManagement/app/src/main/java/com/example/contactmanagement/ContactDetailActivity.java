package com.example.contactmanagement;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.widget.Button;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

public class ContactDetailActivity extends AppCompatActivity {

    private TextView nameTextView, phoneTextView;
    private Button callButton, smsButton, backButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_contact_detail);

        nameTextView = findViewById(R.id.detailName);
        phoneTextView = findViewById(R.id.detailPhone);
        callButton = findViewById(R.id.callButton);
        smsButton = findViewById(R.id.smsButton);
        backButton = findViewById(R.id.backButton);

        String name = getIntent().getStringExtra("name");
        String phone = getIntent().getStringExtra("phone");

        nameTextView.setText(name);
        phoneTextView.setText(phone);

        // Xử lý sự kiện cho nút Gọi
        callButton.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_DIAL);
            intent.setData(Uri.parse("tel:" + phone));
            startActivity(intent);
        });

        // Xử lý sự kiện cho nút Gửi SMS
        smsButton.setOnClickListener(v -> {
            Intent intent = new Intent(Intent.ACTION_SENDTO);
            intent.setData(Uri.parse("smsto:" + phone));
            startActivity(intent);
        });

        // Xử lý sự kiện cho nút Quay lại
        backButton.setOnClickListener(v -> finish());
    }
}
