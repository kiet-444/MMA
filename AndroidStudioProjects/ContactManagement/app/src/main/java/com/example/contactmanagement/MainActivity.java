package com.example.contactmanagement;

import android.content.Intent;
import android.content.SharedPreferences; // Thêm dòng này
import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.util.ArrayList;

public class MainActivity extends AppCompatActivity {
    private RecyclerView recyclerView;
    private ContactAdapter adapter;
    private ArrayList<Contact> contactList;
    private Button addContactButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        recyclerView = findViewById(R.id.recyclerView);
        addContactButton = findViewById(R.id.addContactButton);
        contactList = new ArrayList<>();

        // Tải danh sách liên hệ từ SharedPreferences
        loadContacts();

        adapter = new ContactAdapter(contactList, this);
        recyclerView.setAdapter(adapter);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        addContactButton.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, AddContactActivity.class);
            startActivityForResult(intent, 1);
        });
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == 1 && resultCode == RESULT_OK) {
            String name = data.getStringExtra("name");
            String phone = data.getStringExtra("phone");
            contactList.add(new Contact(name, phone));
            adapter.notifyDataSetChanged();
            saveContacts();  // Lưu danh sách sau khi thêm
        }
    }

    // Phương thức lưu danh sách liên hệ
    private void saveContacts() {
        SharedPreferences sharedPreferences = getSharedPreferences("contact_prefs", MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        Gson gson = new Gson();
        String json = gson.toJson(contactList);
        editor.putString("contact_list", json);
        editor.apply();
    }

    // Phương thức tải danh sách liên hệ
    private void loadContacts() {
        SharedPreferences sharedPreferences = getSharedPreferences("contact_prefs", MODE_PRIVATE);
        Gson gson = new Gson();
        String json = sharedPreferences.getString("contact_list", null);
        TypeToken<ArrayList<Contact>> token = new TypeToken<ArrayList<Contact>>() {};
        contactList = gson.fromJson(json, token.getType());

        if (contactList == null) {
            contactList = new ArrayList<>(); // Khởi tạo danh sách rỗng nếu chưa có
        }
    }
}
